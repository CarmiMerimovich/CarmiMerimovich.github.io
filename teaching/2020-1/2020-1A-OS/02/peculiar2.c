#include <sys/time.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
	int pid = fork();
	if (pid)
		fork();
	fork();
	printf("hello there\n");
    return 0;
}