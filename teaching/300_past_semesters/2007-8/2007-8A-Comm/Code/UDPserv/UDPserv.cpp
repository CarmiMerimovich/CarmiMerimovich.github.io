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
	if ((retval = WSAStartup(0x202,&wsaData)) != 0) {
        fprintf(stderr,"WSAStartup failed with error %d\n",retval);
        WSACleanup();
        return -1;
    }
	//
	// Create a UDP socket
	//
    SOCKET MsgSocket = socket(AF_INET, SOCK_DGRAM, 0);
    if (MsgSocket == INVALID_SOCKET){
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
	me.sin_addr.s_addr = IPstring==NULL?INADDR_ANY:inet_addr(IPstring);
	me.sin_port = htons(SocketPort);
	//
	// Binding the created socket to the IP address and port representing "us".
	//
	if (bind(MsgSocket,(struct sockaddr*)&me,sizeof(me) ) == SOCKET_ERROR) {
        fprintf(stderr,"bind() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        return -1;
    }

	while(1)
	{
		char Buffer[128];				// Buffer receibing datagram
		struct sockaddr_in from;		// Address of sending partner
		int FromLen = sizeof(from);

		retval = recvfrom(MsgSocket, Buffer, sizeof (Buffer),0, (struct sockaddr *)&from,&FromLen);
        if (retval == SOCKET_ERROR) {
            fprintf(stderr,"recv() failed: error %d\n",WSAGetLastError());
            //closesocket(MsgSocket);
            continue;
        }
		printf("From %s:%d, len=%d\n",inet_ntoa(from.sin_addr), ntohs(from.sin_port), retval);

		retval = sendto(MsgSocket, NULL, 0, 0, (struct sockaddr*)&from, sizeof(from));
		if (retval == SOCKET_ERROR) {
			fprintf(stderr,"send() failed: error %d\n",WSAGetLastError());
			WSACleanup();
			return -1;
		}
		
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
