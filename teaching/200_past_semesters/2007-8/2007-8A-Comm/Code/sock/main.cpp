#include <stdio.h>
#include <stdlib.h>

#include "comm.h"

int my_atoi(char *s, int *error);

main(int argc, char *argv[])
{
	
	int argnum = 0;
	int a_server = 0;

	struct Args args;
	args.sendsize = 1024;
	args.port     = 0;
	args.outbuf  = 0;
	args.count    = 0;
	args.dnsname  = NULL;
	args.ipaddr   = NULL;
	args.bindname = NULL;
	args.bindaddr = NULL;
	args.FirstWait = 0;
	args.inbuf = 0;
	args.keepalive = 0;
	args.SuccessiveWait = 0;
	args.receivesize = 1024;
	args.ListenWait = 0;
	args.QueueSize = 1;

	if (argc == 1)
	{
		printf("sock [options] [IP address] port\n\n");
		printf("-s act as a server\n");
		printf("-bIPaddress specified local IP address to bind to\n");
		printf("-nNUM repeat operation NUM times\n");
		printf("-PNUM delay for NUM seconds after connect/accept\n");
		printf("-ONUM delay for NUM seconds after listen\n");
		printf("-pNUM delay for NUM seconds after each send/recv\n");
		printf("-SNUM allocate NUM bytes for outbound buffer\n");
		printf("-RNUM allocate NUM bytes for inbound buffer\n");
		printf("-qNUM Listen queue size\n");
		printf("-wNUM use send with buffer of size NUM (default is 1024)\n");
		printf("-rNUM use receive with buffer of size NUM (default is 1024)\n");
		printf("-K invoke keepalive option");
		exit(0);
	}

	for (int i = 1; i < argc; i++)
	{
		if (argv[i][0] == '-')
		{
			switch (argv[i][1])
			{
				int error;

			case 's':
					a_server = 1;
					break;

			case 'n':
				args.count = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -n should be integer\n");
					exit(1);
				}
				break;

			case 'P':
				args.FirstWait = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -S should be integer\n");
					exit(1);
				}
				break;

			case 'O':
				args.ListenWait = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -O should be integer\n");
					exit(1);
				}
				break;

			case 'q':
				args.QueueSize = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -q should be integer\n");
					exit(1);
				}
				break;

			case 'p':
				args.SuccessiveWait = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -S should be integer\n");
					exit(1);
				}
				break;

			case 'S':
				args.outbuf = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -S should be integer\n");
					exit(1);
				}
				break;

			case 'R':
				args.inbuf = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -R should be integer\n");
					exit(1);
				}
				break;

			case 'w':
				args.sendsize = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -w should be integer\n");
					exit(1);
				}
				break;

			case 'r':
				args.receivesize = my_atoi(&argv[i][2], &error);
				if (error)
				{
					fprintf(stderr, "Argument of -r should be integer\n");
					exit(1);
				}
				break;

			case 'K':
				args.keepalive = 1;
				break;

			case 'b':
				char *p;
				for (p = &argv[i][2]; *p != 0; *p++)
				{
					if (! (*p == '.'  ||
						   ('0' <= *p  && *p <= '9')) ) 
						break;
				}
				if (*p == 0)
					args.bindaddr = &argv[i][2];
				else
					args.bindname = &argv[i][2];
				break;

			case 'i':
				break;

			default:
				printf("Unrecognized option: %c\n", argv[i][1]);
				exit(1);
			}
		}
		else
		{	
			switch (argnum++)
			{
			case 0:
				if (!a_server)
				{
					char *p;
					for (p = &argv[i][0]; *p != 0; *p++)
					{
						if (! (*p == '.'  ||
							   ('0' <= *p  && *p <= '9')) ) 
							break;
					}
					if (*p == 0)
						args.ipaddr = &argv[i][0];
					else
						args.dnsname = &argv[i][0];
				}
				else
				{
					int error;
					args.port = my_atoi(&argv[i][0], &error);
					if (error)
					{
						fprintf(stderr, "Argument should be integer\n");
						exit(1);
					}
				}
				break;

			case 1:
				int error;
				args.port = my_atoi(&argv[i][0], &error);
				if (error)
				{
					fprintf(stderr, "Argument should be integer\n");
					exit(1);
				}
				break;
			}
		}
	}

	comm_init();
	if (a_server)
	{
		if (args.port == 0)
		{
			fprintf(stderr, "port number must be supplied\n");
			exit(1);
		}
		comm_server(&args);
	}

	if (!a_server)
	{
		comm_client(&args);
	}
}

int my_atoi(char *s, int *error)
{
	char *p;
	
	for (p = s; *p != 0; p++)
	{
		if (*p < '0' || *p > '9') 
		{
			*error = 1;
			return(0);
		}
	}
	*error = 0;
	return (atoi(s));
}