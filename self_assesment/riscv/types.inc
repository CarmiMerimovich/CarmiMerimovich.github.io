const rv64Regs = [
     "zero",       // x0
     "ra",
     "sp",
     "gp",
     "tp",
     "t0",         // x5
     "t1",
     "t2",
     "s0",
     "s1",
     "a0",         // x10
     "a1",
     "a2",
     "a3",
     "a4",
     "a5",         // x15
     "a6",
     "a7",
     "s2",
     "s3",
     "s4",         // x20
     "s5",
     "s6",
     "s7",
     "s8",
     "s9",         // X25
     "s10",
     "s11",
     "t3",
     "t4",
     "t5",         // X30
     "t6"
];
const rv64_Btype = Symbol();
const typeB = {
     opCode: 0b110011,
     info: [
          {mnem: "beq",  fnc3: 0b000},
          {mnem: "bne",  fnc3: 0b001},
          {mnem: "blt",  fnc3: 0b100},
          {mnem: "bge",  fnc3: 0b101},
          {mnem: "bltu", fnc3: 0b110},
          {mnem: "bgeu", fnc3: 0b111}
     ]
};