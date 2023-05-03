#include <sys/time.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
	if (argc != 2) {
		fprintf(stderr, "usage: io <file>\n");
		exit(1);
    }
	
	int fd = open(argv[1], O_WRONLY|O_CREAT, S_IRWXU);
	assert(fd >= 0);
	char buffer[20] = { "hello world\n" };
	int rc = write(fd, buffer, strlen(buffer));
	assert(rc == strlen(buffer));
	close(fd);
    return 0;
}