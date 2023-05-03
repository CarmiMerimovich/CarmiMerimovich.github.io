#include <sys/time.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
	int rc = fork();
	if (rc < 0) {
		fprintf(stderr, "fork failed\n");
		exit(1);
	}
	else if (rc == 0) {
		char* args[5] = { "wc", "-l", "exec.c", NULL };
		execvp(args[0], args);
		printf("this shouldn't print out\n");
	}
	else {
		int rc_wait = wait(NULL); // or waitpid(rc,NULL,0)
		printf("I am parent of %d (rc_wait:%d) (pid:%d)\n",
			rc, rc_wait, getpid());
	}
    return 0;
}