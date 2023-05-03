#include <sys/time.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
	printf("hello world (pid:%d)\n", getpid());
	int rc = fork();
	if (rc < 0) {
		fprintf(stderr, "fork failed\n");
		exit(1);
	}
	else if (rc == 0) {
		// child (new process)
		printf("hello, I am child of %d (pid:%d)\n",
			getppid(), getpid());
	}
	else {
		// parent
		printf("hello, I am parent of %d (pid:%d)\n", rc, getpid());
		while (1);
	}
    return 0;
}