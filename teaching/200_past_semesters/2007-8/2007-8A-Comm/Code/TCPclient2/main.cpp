//
//						T C P c l i e n t 2
//
#include <stdio.h>

#include <winsock2.h>

char *IPstring;
int  ServerPort = 0;
char *Cmd = NULL;

int main(int argc, char **argv)
{
	extern void ArgParse(int argc, char **argv, int *port, char **IPstring, char **Cmd);

	ArgParse(argc, argv, &ServerPort, &IPstring, &Cmd);

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
	// Creating a TCP socket
	//
    SOCKET MsgSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (MsgSocket == INVALID_SOCKET){
        fprintf(stderr,"socket() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }
	struct sockaddr_in me;
	me.sin_family = AF_INET;
    me.sin_addr.s_addr = INADDR_ANY;
	me.sin_port = 0;
	//
	// Binding the created socket to the IP address and port representing "us".
	//
	if (bind(MsgSocket, (struct sockaddr*)&me, sizeof(me)) == SOCKET_ERROR)
	{
       fprintf(stderr,"bind() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }

	struct sockaddr_in server;
    server.sin_family = AF_INET;
	server.sin_addr.s_addr = inet_addr(IPstring);
	server.sin_port = htons(ServerPort);

    if (connect(MsgSocket, (struct sockaddr *)&server, sizeof(server)) == SOCKET_ERROR)
	{
        fprintf(stderr,"connect() failed: %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }

	if (Cmd == NULL)
	{
        printf("Running away...\n");
        WSACleanup();
        return -1;
	}

	while (*Cmd != NULL)
	{
		switch (tolower(*Cmd++))
		{
		case 'c':
			closesocket(MsgSocket);
			return 0;

		case 'p':
			retval = send(MsgSocket, "Ping", 4, 0);
			if (retval == SOCKET_ERROR) {
	            fprintf(stderr,"send() failed: error %d\n",WSAGetLastError());
		        WSACleanup();
			    return -1;
			}
			break;

		case 'h':
			for(;;);

		case 'r':
			while (1)
			{
				char Buffer[128];
				retval = recv(MsgSocket, Buffer, sizeof (Buffer), 0);
				if (retval == SOCKET_ERROR)
				{
				    fprintf(stderr,"recv() failed: error %d\n",WSAGetLastError());
					closesocket(MsgSocket);
					WSACleanup();
					return -1;
				}

				if (retval == 0)
					break;
		
				printf("Received %d bytes, data [%.*s] from server\n", retval, retval, Buffer);
			}
			break;
		}
	}

    WSACleanup();
	return(0);
}

void ArgParse(int argc, char **argv, int *port, char **IPstring, char **Cmd)
{
	extern void Usage(char *progname);

	*port = 5001;
	*IPstring = NULL;
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
					case 'c':
						*Cmd = argv[++i];
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
	if (*IPstring == NULL)
            Usage(argv[0]);
}

void Usage(char *progname) {
    fprintf(stderr,"Usage\n%s -p [port] -i [ipaddres]\n",
        progname);
    fprintf(stderr,"Where:");
    fprintf(stderr,"\tport is the port to send to\n");
    fprintf(stderr,"\tipaddre is the ip address (in dotted decimal notation)");
    fprintf(stderr," to send to\n");
    fprintf(stderr,"Default is 5001 for the port\n");
    WSACleanup();
    exit(1);
}
