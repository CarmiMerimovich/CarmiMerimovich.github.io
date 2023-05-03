#include <sys/time.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

void signal_handler(int signal) {
	if (signal == SIGCHLD) {
		int rc = wait(NULL);
		printf("child terminated %d (pid:%d)\n", rc, getpid());
	}
}
int main(int argc, char *argv[])
{
	struct sigaction act;
	sigemptyset (&act.sa_mask);
	act.sa_handler = signal_handler;
	act.sa_flags = 0;
	
	sigaction(SIGCHLD, &act, NULL);
	if (fork()) {
		while (1);
	}
	return 0;
}
