// CreateProcess.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"


int main(int argc, char* argv[])
{
	BOOL b;
	PROCESS_INFORMATION pi;
	STARTUPINFO si;

	ZeroMemory( &si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory( &pi, sizeof(pi) );

	printf("going to create a process");
	char buf[10];
	gets_s(buf, sizeof(buf));

	b = CreateProcess(NULL,
					"\\lala",
					NULL,
					NULL,
					FALSE,
					0,
					NULL,
					NULL,
					&si,
					&pi
					);
	return 0;
}

