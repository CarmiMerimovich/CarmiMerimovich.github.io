#include <windows.h>
#include <winsock.h>

#include <stdio.h>
#include "comm.h"


void printTime()
{
	SYSTEMTIME s;

	GetLocalTime(&s);
	printf("%d:%d:%d.%.3d ", s.wHour, s.wMinute, s.wSecond, s.wMilliseconds);
}

void comm_init(void)
{
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
       exit(1);
    }
}

void comm_server(struct Args *server)
{
    SOCKET ListenSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (ListenSocket == INVALID_SOCKET){
        fprintf(stderr,"socket() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
    }
	//
	// IP address and port number represeting "us".
	// Except for the family field, everything should be in network byte order
	//
	struct sockaddr_in me;
	me.sin_family = AF_INET;
	if (server->bindaddr == NULL)
	    me.sin_addr.s_addr = INADDR_ANY;
	else
		me.sin_addr.s_addr = inet_addr(server->bindaddr);
	me.sin_port = htons(server->port);
	//
	// Binding the created socket to the IP address and port representing "us".
	//
	if (bind(ListenSocket, (struct sockaddr*)&me, sizeof(me)) == SOCKET_ERROR)
	{
        fprintf(stderr,"bind() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
    }

    if (listen(ListenSocket, server->QueueSize) == SOCKET_ERROR)
	{
        fprintf(stderr,"listen() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
    }

	if (server->ListenWait > 0)
		Sleep(server->ListenWait * 1000);

	struct sockaddr_in from;		// Address of sending partner
	int FromLen = sizeof(from);

	SOCKET MsgSocket = accept(ListenSocket, (struct sockaddr *)&from, &FromLen);
    if (MsgSocket == INVALID_SOCKET) {
	    fprintf(stderr,"accept() error %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
      }

	struct sockaddr_in BindAddr, PeerAddr;
	int BindAddrLen = sizeof(BindAddr), PeerAddrLen = sizeof(PeerAddr);
	if (getsockname(MsgSocket, (sockaddr *)&BindAddr, &BindAddrLen) != 0)
	{
        fprintf(stderr,"getsockname() failed: %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
	}
	printTime();
	printf("Established <TCP %s:%d, ", inet_ntoa(BindAddr.sin_addr), ntohs(BindAddr.sin_port));

	if (getpeername(MsgSocket, (sockaddr *)&PeerAddr, &PeerAddrLen) != 0)
	{
        fprintf(stderr,"getpeername() failed: %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
	}
	printf("%s:%d>\n", inet_ntoa(PeerAddr.sin_addr), ntohs(PeerAddr.sin_port));

	if (server->FirstWait != 0)
		Sleep(1000 * server->FirstWait);

	if (server->keepalive != 0)
	{
		int retval = setsockopt(MsgSocket, SOL_SOCKET, SO_KEEPALIVE, (char *)&server->keepalive, sizeof(server->keepalive));
		if (retval == INVALID_SOCKET) {
		    fprintf(stderr,"Setting the keepalive option failed\n");
		    WSACleanup();
			exit(1);
		}
	}

	if (server->inbuf != 0)
	{
		int retval = setsockopt(MsgSocket, SOL_SOCKET, SO_RCVBUF, (char *)&server->inbuf, sizeof(server->inbuf));
		if (retval == INVALID_SOCKET) {
		    fprintf(stderr,"Setting receive buffer size failed\n");
		    WSACleanup();
			exit(1);
		}
		int ReceiveSize;
		int retlen = sizeof(ReceiveSize);
		retval = getsockopt(MsgSocket, SOL_SOCKET, SO_RCVBUF, (char *)&ReceiveSize, &retlen);
		if (retval == INVALID_SOCKET) {
		    fprintf(stderr,"Getting receive buffer size failed\n");
		    WSACleanup();
			exit(1);
		}
		if (ReceiveSize != server->inbuf)
			fprintf(stderr, "Warning: Allocated receive buffer is only %d bytes\n", ReceiveSize);
	}

	void *msg = malloc(server->receivesize);
	if (msg == NULL)
	{
		fprintf(stderr, "allocation of buffer failed\n");
		exit(1);
	}

	while (1)
	{
		int retval = recv(MsgSocket, (char *)msg, server->receivesize, 0);
		if (retval == SOCKET_ERROR)
		{
			fprintf(stderr,"recv() failed: error %d\n",WSAGetLastError());
			closesocket(MsgSocket);
			WSACleanup();
			exit(1);
		}
		printTime();
		if (retval != 0)
			printf("server: %d bytes received\n", retval);
		else
			printf("server: Connection closed\n");
		if (server->SuccessiveWait != 0)
			Sleep(1000 * server->SuccessiveWait);

		if (retval == 0)
			break;
	}
	closesocket(MsgSocket);
	WSACleanup();
}

void comm_client(struct Args *client)
{
	//
	// Creating a TCP socket
	//
    SOCKET MsgSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (MsgSocket == INVALID_SOCKET){
        fprintf(stderr,"socket() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
    }
	struct sockaddr_in me;
	me.sin_family = AF_INET;
	if (client->bindaddr == NULL)
	    me.sin_addr.s_addr = INADDR_ANY;
	else
		me.sin_addr.s_addr = inet_addr(client->bindaddr);
	me.sin_port = 0;
	//
	// Binding the created socket to the IP address and port representing "us".
	//
	if (bind(MsgSocket, (struct sockaddr*)&me, sizeof(me)) == SOCKET_ERROR)
	{
       fprintf(stderr,"bind() failed with error %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
    }

	struct sockaddr_in server;
    server.sin_family = AF_INET;
	server.sin_addr.s_addr = inet_addr(client->ipaddr);
	server.sin_port = htons(client->port);

    if (connect(MsgSocket, (struct sockaddr *)&server, sizeof(server)) == SOCKET_ERROR)
	{
        fprintf(stderr,"connect() failed: %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
    }

	struct sockaddr_in BindAddr, PeerAddr;
	int BindAddrLen = sizeof(BindAddr), PeerAddrLen = sizeof(PeerAddr);
	if (getsockname(MsgSocket, (sockaddr *)&BindAddr, &BindAddrLen) != 0)
	{
        fprintf(stderr,"getsockname() failed: %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
	}
	printTime();
	printf("Established <TCP %s:%d, ", inet_ntoa(BindAddr.sin_addr), ntohs(BindAddr.sin_port));

	if (getpeername(MsgSocket, (sockaddr *)&PeerAddr, &PeerAddrLen) != 0)
	{
        fprintf(stderr,"getpeername() failed: %d\n",WSAGetLastError());
        WSACleanup();
        exit(1);
	}
	printf("%s:%d>\n", inet_ntoa(PeerAddr.sin_addr), ntohs(PeerAddr.sin_port));

	if (client->FirstWait != 0)
		Sleep(1000 * client->FirstWait);

	if (client->keepalive != 0)
	{
		int retval = setsockopt(MsgSocket, SOL_SOCKET, SO_KEEPALIVE, (char *)&client->keepalive, sizeof(client->keepalive));
		if (retval == INVALID_SOCKET) {
		    fprintf(stderr,"Setting the keepalive option failed\n");
		    WSACleanup();
			exit(1);
		}
	}

	if (client->outbuf != 0)
	{
		int retval = setsockopt(MsgSocket, SOL_SOCKET, SO_SNDBUF, (char *)&client->outbuf, sizeof(client->outbuf));
		if (retval == INVALID_SOCKET) {
		    fprintf(stderr,"Setting send buffer size failed\n");
		    WSACleanup();
			exit(1);
		}
		int BufSize;
		int retlen = sizeof(BufSize);
		retval = getsockopt(MsgSocket, SOL_SOCKET, SO_RCVBUF, (char *)&BufSize, &retlen);
		if (retval == INVALID_SOCKET) {
		    fprintf(stderr,"Getting send buffer size failed\n");
		    WSACleanup();
			exit(1);
		}
		if (BufSize != client->outbuf)
			fprintf(stderr, "Warning: Allocated receive buffer is only %d bytes\n", BufSize);
	}


	void *msg = malloc(client->sendsize);
	if (msg == NULL)
	{
		fprintf(stderr, "allocation of buffer failed\n");
		exit(1);
	}
	for (int i = 0; i < client->count; i++)
	{
		//
		// What to send
		//


		//
		// Send a TCP stream.
		// The fourth parameter is for flags (e.g., MSG_DONTROUTE).
		//
        int retval = send(MsgSocket, (char *)msg, client->sendsize,0);
        if (retval == SOCKET_ERROR) {
            fprintf(stderr,"send() failed: error %d\n",WSAGetLastError());
            WSACleanup();
            exit(1);
        }
		printTime();
		printf("client: %d bytes on send #%d\n", retval, i);
		if (client->SuccessiveWait != 0)
			Sleep(1000 * client->SuccessiveWait);
	}
	free(msg);
	closesocket(MsgSocket);
}