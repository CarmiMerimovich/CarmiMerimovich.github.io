//
//					T C P s e r v 2
//
#include <stdio.h>

#include <winsock2.h>

char *IPstring = NULL;
int SocketPort = 5001;

struct SocketWhat
{
	SOCKET id;		// Socket handle
	int	whatR;		// Receiving?
	int	whatS;		// Sending?
	int whatSt;		// Sending sub-type
	char buffer[128];
	int len;
};
#define MAX_SOCKETS 6
#define WHAT_LISTEN  1
#define WHAT_RECEIVE 2
#define WHAT_IDLE    3
#define WHAT_SEND    4
#define WHAT_SEND_PING 1
#define WHAT_EMPTY 0
struct SocketWhat Socket[MAX_SOCKETS];
int SocketCount = 0;


int main(int argc, char **argv)
{
	extern void ArgParse(int argc, char **argv, int *port, char **IPstring);
	void H_accept(int index);
	void H_receive(int index);
	void H_send(int index);
	BOOL SocketAdd(SOCKET id, int what);

	ArgParse(argc, argv, &SocketPort, &IPstring);

	//
	// Initializing the WS2_32.DLL.
	// We give the version we use. We get back implementation details.
	//
	WSADATA wsaData;
    int retval;
	if ((retval = WSAStartup(0x202,&wsaData)) != 0)
	{
        fprintf(stderr,"WSAStartup failed with error %d\n",retval);
        WSACleanup();
        return -1;
    }
	//
	// Create a TCP socket
	//
    SOCKET ListenSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (ListenSocket == INVALID_SOCKET){
        fprintf(stderr,"socket() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }

	//
	// IP address and port number represeting "us".
	// Except for the family field, everything should be in network byte order
	//
	struct sockaddr_in me;
	me.sin_family = AF_INET;
	me.sin_addr.s_addr = INADDR_ANY; 
	me.sin_port = htons(SocketPort);
	//
	// Binding the created socket to the IP address and port representing "us".
	//
	if (bind(ListenSocket, (struct sockaddr*)&me, sizeof(me)) == SOCKET_ERROR)
	{
        fprintf(stderr,"bind() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }

    if (listen(ListenSocket,5) == SOCKET_ERROR)
	{
        fprintf(stderr,"listen() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }

	SocketAdd(ListenSocket, WHAT_LISTEN);

	while(1)
	{
		fd_set WaitRecv;
		FD_ZERO(&WaitRecv);
		for (int i = 0; i < SocketCount; i++)
		{
			if ((Socket[i].whatR == WHAT_LISTEN) || (Socket[i].whatR == WHAT_RECEIVE))
				FD_SET(Socket[i].id, &WaitRecv);
		}

		fd_set WaitSend;
		FD_ZERO(&WaitSend);
		for (int i = 0; i < SocketCount; i++)
		{
			if (Socket[i].whatS == WHAT_SEND)
				FD_SET(Socket[i].id, &WaitSend);
		}

		//
		// Wait for interesting event.
		// Note: First argument is ignored.
		// Last is a timeout, hence we are blocked if nothing happens.
		//
		int n;
		if ((n = select(0, &WaitRecv, &WaitSend, NULL, NULL)) == SOCKET_ERROR)
		{
			fprintf(stderr,"select() failed with error %d\n",WSAGetLastError());
	        WSACleanup();
			return -1;
		}


		for (int i = 0; i < SocketCount && n > 0; i++)
		{
			if (FD_ISSET(Socket[i].id, &WaitRecv))
			{
				n--;
				switch (Socket[i].whatR)
				{
				case WHAT_LISTEN:
					H_accept(i);
					break;

				case WHAT_RECEIVE:
					H_receive(i);
					break;
				}
			}
		}

		for (int i = 0; i < SocketCount && n > 0; i++)
		{
			if (FD_ISSET(Socket[i].id, &WaitSend))
			{
				n--;
				switch (Socket[i].whatS)
				{
				case WHAT_SEND:
					H_send(i);
					break;

				}
			}
		}
	}
}

void SocketRemove(int index)
{
	Socket[index].whatR = WHAT_EMPTY;
	Socket[index].whatS = WHAT_EMPTY;
	SocketCount--;
	if (SocketCount < 0)
	{
		printf("SocketCount got NEGATIVE. Definitely a BUG!!!\n");
		SocketCount = 0;
	}
}
BOOL SocketAdd(SOCKET id, int what)
{
	for (int i = 0; i < MAX_SOCKETS; i++)
	{
		if (Socket[i].whatR == WHAT_EMPTY)
		{
			Socket[i].id = id;
			Socket[i].whatR = what;
			Socket[i].whatS = WHAT_IDLE;
			Socket[i].len = 0;
			SocketCount++;
			return(true);
		}
	}
	return(false);
}

void H_accept(int index)
{
	SOCKET id = Socket[index].id;
	struct sockaddr_in from;		// Address of sending partner
	int FromLen = sizeof(from);

	SOCKET MsgSocket = accept(id, (struct sockaddr *)&from, &FromLen);
    if (MsgSocket == INVALID_SOCKET) {
        fprintf(stderr,"accept() error %d\n",WSAGetLastError());
        return;
    }
	printf("Accepting %s:%d\n",inet_ntoa(from.sin_addr), ntohs(from.sin_port));

	//
	// Set the socket to be in non-blocking mode.
	//
	unsigned long flag=1;
	if (ioctlsocket(MsgSocket, FIONBIO, &flag) != 0)
	{
        fprintf(stderr,"ioctlsocket() failed with error %d\n",WSAGetLastError());
	}

	if (!SocketAdd(MsgSocket, WHAT_RECEIVE))
	{
		printf("\t\tToo much connections, dropped!\n");
		closesocket(id);
	}
	return;
}

void H_receive(int index)
{
	SOCKET MsgSocket = Socket[index].id;

	int len = Socket[index].len;
	int retval = recv(MsgSocket, &Socket[index].buffer[len], sizeof (Socket[index].buffer) - len, 0);
	if (retval == SOCKET_ERROR)
	{
		fprintf(stderr,"recv() failed: error %d\n",WSAGetLastError());
		SocketRemove(index);
		closesocket(MsgSocket);
		return;
	}

	if (retval == 0)
	{
		closesocket(MsgSocket);
		SocketRemove(index);
		return;
	}

	Socket[index].len += retval;
	if (Socket[index].len >= 4)
	{
		if (strncmp(Socket[index].buffer, "Ping", 4) == 0)
		{
			Socket[index].whatS  = WHAT_SEND;
			Socket[index].whatSt = WHAT_SEND_PING;
			memcpy(Socket[index].buffer, &Socket[index].buffer[4], Socket[index].len - 4);
			Socket[index].len -= 4;
			return;
		}
		if (strncmp(Socket[index].buffer, "Exit", 4) == 0)
		{
			closesocket(MsgSocket);
			SocketRemove(index);
			return;
		}
	}

}

void H_send(int index)
{
	SOCKET MsgSocket = Socket[index].id;
	if (Socket[index].whatSt == WHAT_SEND_PING)
	{
		char *PingMsg = "Simple Ping Reply";
		int retval = send(MsgSocket, PingMsg, strlen(PingMsg), 0);
		if (retval == SOCKET_ERROR) {
			fprintf(stderr,"send() failed: error %d\n",WSAGetLastError());
		}
	}	
	Socket[index].whatS = WHAT_IDLE;
}

void ArgParse(int argc, char **argv, int *port, char **IPstring)
{
	extern void Usage(char *progname);
    /* Parse arguments */
    if (argc >1)
	{
		int i;
        for(i=1;i <argc;i++)
		{
            if ( (argv[i][0] == '-') || (argv[i][0] == '/') )
			{
                switch(tolower(argv[i][1])) {
                    case 'i':
                        *IPstring = argv[++i];
                        break;
                    case 'p':
                        *port = atoi(argv[++i]);
                        break;
                    default:
                        Usage(argv[0]);
                        break;
                }
            }
            else
                Usage(argv[0]);
        }
    }
}

void Usage(char *progname) {
    fprintf(stderr,"Usage\n%s -e [port] -i [ipaddres]\n",
        progname);
    fprintf(stderr,"Where:");
    fprintf(stderr,"\tport is the port to listen on\n");
    fprintf(stderr,"\tipaddre is the ip address (in dotted decimal notation)");
    fprintf(stderr," to bind to\n");
    fprintf(stderr,"Defaults are 5001 and INADDR_ANY\n");
    WSACleanup();
    exit(1);
}
