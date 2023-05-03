#define I0SHIFT (9+9+12)
#define I0MASK   0x3
#define I1SHIFT (9+12)
#define I1MASK   0x1FF
#define I2SHIFT (12)
#define I2MASK   0x1FF

uint *walkpgdir2(uint *pgdir, uint addr, int alloc) {
	uint i0 = (addr >> I0SHIFT) & I0MASK;
	uint *tab1 = p2v(pgdir[i0*2]);
	if (tab1 & 1)
		tab1 = PTE_ADDR(tab1);
	else {
		if (!alloc  ||  (tab1 = kalloc()) == 0)
			return 0;

		memset(tab1, 0, PGSIZE);
		pgdir[i0*2] = v2p(tab1) | PTE_P | PTE_W | PTE_U;
	}
	
	uint i1 = (addr >> I1SHIFT) & I1MASK;
	uint *tab2 = p2v(tab1[i1*2]);
	if (tab1[i1*2] & 1)
		tab2 = PTE_ADDR(tab2);
	else {
		if (!alloc  ||  (tab2 = kalloc()) == 0)
			return 0;

		memset(tab2, 0, PGSIZE);
		tab1[i1*2] = v2p(tab2) | PTE_P | PTE_W | PTE_U;
	}

	uint i2 = (addr >> I2SHIFT) & I2MASK;	
	return (&tab2[i2*2]);
}

argument(int n, int *val) {
	uint addr = proc->tf->esp + 4 + 4*n;
	if (addr >= proc->sz  ||  addr + 3 >= proc->sz)
		return (-1);
	*val = *(int *)addr;
	return (0);
}
