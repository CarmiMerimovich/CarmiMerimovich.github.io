//
//
//  Q. 1
//
//
struct dirent2 {
	ushort inum;
	uchar  len;
	char   name[255];
};
//
// Option 1
//
struct inode *dirlookup2(struct inode *dp, char *name, uint *poff) {
	uint off, inum;
	struct dirent2 de;

	if (dp->type != T_DIR)
		panic("dirlookup not DIR");

	for (off = 0; off < dp->size; off += de.len) {
		if (readi(dp, (char*)&de, off, 3) != 3)
			panic("dirlookup2 read");
		off += 3;
		if(de.inum == 0  ||  de.len == 0)
			continue;		
		if (readi(dp, (char*)de.name, off, de.len) != de.len)
			panic("dirlookup2 read");
		if (de.len < 255) de.name[de.len] = 0;
		if (name2cmp(name, de.name) == 0) {
			if (poff)
				*poff = off;
			inum = de.inum;
			return iget(dp->dev, inum);
		}
	}
	return 0;
}
%
%
//
// Option 2
//
struct inode *dirlookup2(struct inode *dp, char *name, uint *poff) {
	uint off, inum;
	struct dirent2 de;

	if (dp->type != T_DIR)
		panic("dirlookup not DIR");

	for (off = 0; off < dp->size; off += 3 + de.len) {
		int l = readi(dp, (char*)&de, off, sizeof(de));
		if (l < 3  ||  l != 3 + de.len)
			panic("dirlookup2 read");
		if(de.inum == 0  ||  de.len == 0)
			continue;		
		if (de.len < 255) de.name[de.len] = 0;
		if (name2cmp(name, de.name) == 0) {
			if (poff)
				*poff = off;
			inum = de.inum;
			return iget(dp->dev, inum);
		}
	}
	return 0;
}
//
// the existing strncmp can be definitely used
// instead of the following
//
int name2cmp(char *p, char *q) {
	uint n;
	for (n = 255; n > 0 && *p && *p == *q; n--, p++, q++);
	return n;
}
//
//
//  Q. 2
//
//
int sbrk(uint n) {
	char *mem;
	uint a, a0;
	uint *pte;
	
	uint newsz = proc->sz + n;
	if (newsz >= KERNBASE)
		return -1;

	for (a = PGROUNDUP(proc->sz); a < newsz; a += PGSIZE) {
		if ((pte = walkpgdir(proc->pgdir, a, 1)) == 0)
			goto bad;
		if ((mem = kalloc()) == 0)
			goto bad;
		memset(mem, 0, PGSIZE);

		*pte = v2p(mem) | PTE_P | PTE_W | PTE_U;
	}
	proc->sz = newsz;
	return (0);
bad:
	for (a0 = PGROUNDUP(proc->sz); a > a0; ) {
		a -= PGSIZE;
		if ((pte = walkpgdir(proc->pgdir, a, 0)) == 0)
			panic("Just allocated here!!");
		kfree(p2v(PTE_ADDR(*pte)));
	}
	return (-1);
}