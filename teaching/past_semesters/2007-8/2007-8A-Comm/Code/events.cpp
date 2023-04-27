// Events.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#include <windows.h>
#include <stdlib.h>
#include <winsock.h>

SOCKET UDPsocket;

void init(void)
{
	WSADATA wsaData;
	int retval;
	if ((retval = WSAStartup(0x202,&wsaData)) != 0) {
		fprintf(stderr,"WSAStartup failed with error %d\n",retval);
		exit(1);
	}

	UDPsocket = ::socket(AF_INET, SOCK_DGRAM, 0);
    if (UDPsocket == INVALID_SOCKET){
        fprintf(stderr,"socket() failed with error %d\n",WSAGetLastError());
        exit(1);
    }

	unsigned long flag=1;
	if (ioctlsocket(UDPsocket, FIONBIO, &flag) != 0)
	{
        fprintf(stderr,"ioctlsocket() failed with error %d\n",WSAGetLastError());
		exit(1);
	}

	sockaddr_in me;
	me.sin_family = AF_INET;
	me.sin_addr.s_addr = inet_addr("127.0.0.1");
	me.sin_port = 0;
	if (bind(UDPsocket,(struct sockaddr*)&me,sizeof(me) ) == SOCKET_ERROR) {
        fprintf(stderr,"bind() failed with error %d\n",WSAGetLastError());
        exit(1);
    }
	return ;
}

#define EVENT_KB      1
#define EVENT_TIMEOUT 2
#define EVENT_UDPIN   3

struct Event
{
	int type;
	char ascii;
	int state;
};

struct Event EventGet(void)
{
	HANDLE ConIn = GetStdHandle(STD_INPUT_HANDLE);
	DWORD count;
	::GetNumberOfConsoleInputEvents(ConIn, &count);
//	printf("count=%d\r\n", count);
	while (count > 0)
	{
		DWORD c;
		INPUT_RECORD event;
		ReadConsoleInput(ConIn, &event, 1, &c);
		if (event.EventType == KEY_EVENT)
		{
			char c = event.Event.KeyEvent.uChar.AsciiChar;
			struct Event e;
			e.type = EVENT_KB;
			e.ascii = c;
			e.state = event.Event.KeyEvent.bKeyDown;
			//
			// Note that we ignore lots of info here.
			// For our purpose, it is enough.
			//
			return (e);
		}
		::GetNumberOfConsoleInputEvents(ConIn, &count);
	}

	FD_SET Inbound;
	TIMEVAL timeout = {1, 0};

	FD_ZERO(&Inbound);
	FD_SET(UDPsocket, &Inbound);
	int n = ::select(0, &Inbound, 0, 0, &timeout);
	if (n <= 0)
	{
		struct Event e;
		e.type = EVENT_TIMEOUT;
		return (e);
	}
	struct Event e;
	e.type = EVENT_UDPIN;
	return (e);
}

int main(int argc, char  *argv[])
{
	init();
	while (1)
	{
		struct Event e = EventGet();
		switch (e.type)
		{
		case EVENT_KB:
			if (e.state)
				printf("Ascii %d has been pressed\r\n", e.ascii);
			else
				printf("Ascii %d has been released\r\n", e.ascii);
			break;

		case EVENT_TIMEOUT:
			printf("Timeout...\r\n");
			break;

		case EVENT_UDPIN:
			{
			sockaddr_in from;
			int sizeaddr = sizeof(from);
			char buf[80];
			int retval = recvfrom(UDPsocket, buf, sizeof(buf), 0, (sockaddr *)&from, &sizeaddr);
			if (retval == SOCKET_ERROR)
				fprintf(stderr,"recvfrom() failed: error %d\r\n",WSAGetLastError());
			else
			{
				printf("Received %d bytes from %s:%d.\r\n", retval, inet_ntoa(from.sin_addr), ntohs(from.sin_port));
			}
			break;
			}
		}
	}
}

