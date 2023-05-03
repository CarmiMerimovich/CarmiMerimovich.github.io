#include <sys/time.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

int main(int argc, char *argv[])
{
	struct sigaction act;
	sigemptyset (&act.sa_mask);
	act.sa_handler = SIG_IGN;
	act.sa_flags = 0;

	if (sigaction (SIGINT, &act, NULL) == -1) {
		fprintf(stderr, "sigaction failed\n");
		exit(1);
	}

	while (1);
    return 0;
}