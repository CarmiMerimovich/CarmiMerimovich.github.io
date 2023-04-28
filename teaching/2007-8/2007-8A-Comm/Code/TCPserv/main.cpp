//
//						T C P s e r v
//
#include <stdio.h>

#include <winsock2.h>

char *IPstring = NULL;
int SocketPort = 5001;

int main(int argc, char **argv)
{
	extern void ArgParse(int argc, char **argv, int *port, char **IPstring);

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

	while (1)
	{
		struct sockaddr_in from;		// Address of sending partner
		int FromLen = sizeof(from);

		printf("Waiting for connect...\n");
		SOCKET MsgSocket = accept(ListenSocket, (struct sockaddr *)&from, &FromLen);
        if (MsgSocket == INVALID_SOCKET) {
            fprintf(stderr,"accept() error %d\n",WSAGetLastError());
             WSACleanup();
             return -1;
        }
		printf("Accepting %s:%d\n",inet_ntoa(from.sin_addr), ntohs(from.sin_port));

		int expected = 27;
		while (expected > 0)
		{
			char Buffer[128];				// Buffer receiving datagram

			retval = recv(MsgSocket, Buffer, sizeof (Buffer), 0);
			if (retval == SOCKET_ERROR) {
				fprintf(stderr,"recv() failed: error %d\n",WSAGetLastError());
				closesocket(MsgSocket);
				WSACleanup();
				return -1;
			}

			if (retval == 0) {
				printf("Client closed the connection\n");
				break;
			}
			printf("Received %d bytes, data [%.*s] from client\n", retval, retval, Buffer);
			expected -= retval;

	        retval = send(MsgSocket, "Stam", 4, 0);
			if (retval == SOCKET_ERROR) {
				fprintf(stderr,"send() failed: error %d\n",WSAGetLastError());
				WSACleanup();
				return -1;
			}	
		}
		closesocket(MsgSocket);
	}
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
