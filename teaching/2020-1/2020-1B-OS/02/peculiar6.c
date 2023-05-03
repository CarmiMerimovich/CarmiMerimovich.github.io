#include <sys/time.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
	int x = 0;
	if (fork()) {
		sleep(5); // BLOCKED state for 5 seconds
	}
	else {
		x += 3;
	}
	printf("%d", x);
}

