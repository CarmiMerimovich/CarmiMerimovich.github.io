let rv64 = {};

rv64.registerName = [
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

//
// For each instruction class
// (Really for each opcode, as for now)
//
rv64.B = {};
rv64.I0 = {};
rv64.I1 = {};


rv64.B = {
     machineInstructions: {
          opCode: 0b110011,
          info: [
               {mnem: "beq",  fnc3: 0b000},
               {mnem: "bne",  fnc3: 0b001},
               {mnem: "blt",  fnc3: 0b100},
               {mnem: "bge",  fnc3: 0b101},
               {mnem: "bltu", fnc3: 0b110},
               {mnem: "bgeu", fnc3: 0b111}
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "B";

          ret.fieldHeader = [
          "imm[12]",
          "imm[10:5]",
          "rs1",
          "rs2",
          "fnc3",
          "imm[4:1]",
          "imm[11]",
          "opcode"
          ];

          ret.asmFields = ["rs1", "rs2", "imm"];

          ret.varName = [
          "imm_12",
          "imm_5_10",
          "rs1",
          "rs2",
          "fnc3",
          "imm_1_4",
          "imm_11",
          "opCode"
          ];

          ret.vars = {};
          let v = ret.vars;


          v.opCode = {};
          v.opCode.num = this.machineInstructions.opCode;
          v.opCode.bin = v.opCode.num.toString(2).padStart(7, "0");

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          v.mnem = this.machineInstructions.info[idx].mnem;

          ret.vars.fnc3 = {};
          ret.vars.fnc3.num = this.machineInstructions.info[idx].fnc3;
          ret.vars.fnc3.bin = ret.vars.fnc3.num.toString(2).padStart(3,"0");

          ret.vars.rs1 = {};
          ret.vars.rs1.num = Math.trunc(Math.random() * 32);
          ret.vars.rs1.bin = ret.vars.rs1.num.toString(2).padStart(5,"0");
          ret.vars.rs1.str = Math.random() < 0.5 ?
                              "x" + v.rs1.num.toString():
                              rv64.registerName[v.rs1.num];

          v.rs2 = {};
          v.rs2.num = Math.trunc(Math.random() * 32);
          v.rs2.bin = ret.vars.rs1.num.toString(2).padStart(5,"0");
          v.rs2.str = Math.random() < 0.5 ?
                              "x" + v.rs2.num.toString():
                              rv64.registerName[v.rs2.num];

          v.imm = {};
          v.imm.num = (-2048 + Math.trunc(Math.random() * 4096)) * 2;
          let n = v.imm.num >= 0?
                    v.imm.num :
                    v.imm.num + 8192;
          v.imm.bin = n.toString(2).padStart(13,"0");

          let t = ret.vars.imm.bin.split("").reverse().join("");

          v.imm_12 = {};
          v.imm_12.bin = t.substring(12, 13);
          v.imm_12.num = parseInt(v.imm_12.bin, 2);

          v.imm_11 = {};
          v.imm_11.bin = t.substring(11, 12);
          v.imm_11.num = parseInt(v.imm_11.bin, 2);

          v.imm_5_10 = {};
          v.imm_5_10.bin = t.substring(5, 11);
          v.imm_5_10.num = parseInt(v.imm_5_10.bin, 2);

          v.imm_1_4 = {};
          v.imm_1_4.bin = t.substring(1, 5);
          v.imm_1_4.num = parseInt(v.imm_1_4.bin, 2);

          ret.str = `${v.mnem}\t${v.rs1.str},${v.rs2.str},${v.imm.num}`;

          let mi = "";
          for (let i = 0; i < ret.varName.length; i++) {
               mi += v[ret.varName[i]].bin;
          }

          ret.machineCode = {};
          ret.machineCode.bin = mi;
          ret.machineCode.num = parseInt(mi, 2);
          ret.machineCode.hex = ret.machineCode.num.
                                        toString(16).padStart(8, "0").toUpperCase();

          return (ret);
     }
};




rv64.randomInstruction = function () {
     let i = Math.trunc(Math.random() * rv64.types.length);
     return (rv64.types[i].randomInstruction());
}



rv64.I0 = {
     machineInstructions: {
          opCode: 0b000011,
          memory: true,
          info: [
               {mnem: "lb",  fnc3: 0b000},
               {mnem: "lh",  fnc3: 0b001},
               {mnem: "lw",  fnc3: 0b010},
               {mnem: "ld",  fnc3: 0b011},
               {mnem: "lbu", fnc3: 0b100},
               {mnem: "lhu", fnc3: 0b101},
               {mnem: "lwu", fnc3: 0b110},
          ]
     },

     randomInstruction() {
          return(randomInstruction_I(this));
     }
};

rv64.I1 = {
     machineInstructions: {
          opCode: 0b1100111,
          memory: true,
          info: [
               {mnem: "jalr",  fnc3: 0b000}
          ]
     },

     randomInstruction() {
          return(randomInstruction_I(this));
     }
};

rv64.I2 = {
     machineInstructions: {
          opCode: 0b0010011,
          info: [
               {mnem: "addi",  fnc3: 0b000},
               {mnem: "slti",  fnc3: 0b010},
               {mnem: "sltiu", fnc3: 0b011},
               {mnem: "xori",  fnc3: 0b100},
               {mnem: "ori",   fnc3: 0b110},
               {mnem: "andi",  fnc3: 0b111}
          ]
     },

     randomInstruction() {
          return(randomInstruction_I(this));
     }
};

rv64.I3 = {
     machineInstructions: {
          opCode: 0b0010011,
          info: [
               {mnem: "slli",  fnc3: 0b001, strange: 0b000000},
               {mnem: "srl",   fnc3: 0b101, strange: 0b000000},
               {mnem: "srai",  fnc3: 0b101, strange: 0b000000},
          ]
     },

     randomInstruction() {
          return(randomInstruction_I(this));
     }
};

function randomInstruction_I(th) {
     let ret = {};

     ret.type = "I";

     ret.fieldHeader = [
         "imm",
         "rs1",
         "fnc3",
         "rd",
         "opcode"
     ];

     ret.varName = [
         "imm",
         "rs1",
         "fnc3",
          "rd",
         "opCode"
     ];

     ret.asmFields = ["rs1", "rd", "imm"];

     ret.vars = {};
     let v = ret.vars;


     v.opCode = {};
     v.opCode.num = th.machineInstructions.opCode;
     v.opCode.bin = v.opCode.num.toString(2).padStart(7, "0");

     let idx = Math.trunc(Math.random() * th.machineInstructions.info.length);
     let mI = th.machineInstructions.info[idx];
     v.mnem = mI.mnem;

     ret.vars.fnc3 = {};
     ret.vars.fnc3.num = th.machineInstructions.info[idx].fnc3;
     ret.vars.fnc3.bin = ret.vars.fnc3.num.toString(2).padStart(3,"0");

     ret.vars.rs1 = {};
     ret.vars.rs1.num = Math.trunc(Math.random() * 32);
     ret.vars.rs1.bin = ret.vars.rs1.num.toString(2).padStart(5,"0");
     ret.vars.rs1.str = Math.random() < 0.5 ?
                          "x" + v.rs1.num.toString():
                          rv64.registerName[v.rs1.num];

     v.rd = {};
     v.rd.num = Math.trunc(Math.random() * 32);
     v.rd.bin = ret.vars.rd.num.toString(2).padStart(5,"0");
     v.rd.str = Math.random() < 0.5 ?
                          "x" + v.rd.num.toString():
                          rv64.registerName[v.rd.num];

     v.imm = {};
     if (typeof mI.strange == "undefine")
          v.imm.num = -2048 + Math.trunc(Math.random() * 4096);
     else
          v.imm.num = Math.trunc(Math.random() * 64);

     let n = v.imm.num >= 0?
               v.imm.num :
               v.imm.num + 4096;
     v.imm.bin = n.toString(2).padStart(12,"0");

     let t = ret.vars.imm.bin.split("").reverse().join("");

     console.log(typeof(th.memory),  th.memory);
     if (typeof(th.machineInstructions.memory) != "undefined" && th.machineInstructions.memory)
          ret.str = `${v.mnem}\t${v.rd.str}, ${v.imm.num}(${v.rs1.str})`;
     else
          ret.str = `${v.mnem}\t${v.rd.str}, ${v.rs1.str}, ${v.imm.num}`;

     let mi = "";
     for (let i = 0; i < ret.varName.length; i++) {
          mi += v[ret.varName[i]].bin;
     }

     ret.machineCode = {};
     ret.machineCode.bin = mi;
     ret.machineCode.num = parseInt(mi, 2);
     ret.machineCode.hex = ret.machineCode.num.
                                   toString(16).padStart(8, "0").toUpperCase();

     return (ret);
}

rv64.types = [rv64.B, rv64.I0, rv64.I1, rv64.I2, rv64.I3];
