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

rv64.randomInstruction = function () {
     let i = Math.trunc(Math.random() * rv64.types.length);
     return (rv64.types[i].randomInstruction());
}


//
// For each instruction class
// (Really for each opcode, as for now)
//

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

     randomInstruction() { // random B-cass instruction
          let ret = {};

          ret.type = "B";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;


          ret.idFieldName = ["opcode", "fnc3"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rs1", "rs2", "imm13"];
          ret.miFieldName = [ // machine instruction format
               "imm13[12]",
               "imm13[10:5]",
               "rs1",
               "rs2",
               "fnc3",
               "imm13[4:1]",
               "imm13[11]",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);

          return (ret);
     }
};

rv64.U0 = {
     machineInstructions: {
          opCode: 0b0110111,
          info: [
               {mnem: "lui"},
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "U";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;

          ret.idFieldName = ["opcode"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "imm20"];
          ret.miFieldName = [ // machine instruction format
               "imm20",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};

rv64.U1 = {
     machineInstructions: {
          opCode: 0b0010111,
          info: [
               {mnem: "auipc"},
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "U";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;

          ret.idFieldName = ["opcode"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "imm20"];
          ret.miFieldName = [ // machine instruction format
               "imm20",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};



rv64.J = {
     machineInstructions: {
          opCode: 0b1101111,
          memory: true,
          info: [
               {mnem: "jal"}
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "J";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;

          ret.idFieldName = ["opcode"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "imm21"];
          ret.miFieldName = [ // machine instruction format
               "imm21[20]",
               "imm21[10:1]",
               "imm21[11]",
               "imm21[19:12]",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};


rv64.S = {
     machineInstructions: {
          opCode: 0b0100011,
          memory: true,
          info: [
               {mnem: "sb",  fnc3: 0b000},
               {mnem: "sh",  fnc3: 0b001},
               {mnem: "sw",  fnc3: 0b010},
               {mnem: "sd",  fnc3: 0b011}
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "S";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.memory = true;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;

          ret.idFieldName = ["opcode", "fnc3"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rs1", "rs2", "imm12"];
          ret.miFieldName = [ // machine instruction format
               "imm12[11:5]",
               "rs2",
               "rs1",
               "fnc3",
               "imm12[4:0]",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};

rv64.I0 = {
     machineInstructions: {
          opCode: 0b0000011,
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
          let ret = {};

          ret.type = "I";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.memory = true;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;


          ret.idFieldName = ["opcode", "fnc3"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "rs1", "imm12"];
          ret.miFieldName = [ // machine instruction format
               "imm12",
               "rs1",
               "fnc3",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
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
          let ret = {};

          ret.type = "I";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.memory = true;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;


          ret.idFieldName = ["opcode", "fnc3"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "rs1", "imm12"];
          ret.miFieldName = [ // machine instruction format
               "imm12",
               "rs1",
               "fnc3",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
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
          let ret = {};

          ret.type = "I";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;


          ret.idFieldName = ["opcode", "fnc3"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "rs1", "imm12"];
          ret.miFieldName = [ // machine instruction format
               "imm12",
               "rs1",
               "fnc3",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};

rv64.I3 = {
     machineInstructions: {
          opCode: 0b0010011,
          info: [
               {mnem: "slli",  fnc3: 0b001, fnc6: 0b000000},
               {mnem: "srl",   fnc3: 0b101, fnc6: 0b000000},
               {mnem: "srai",  fnc3: 0b101, fnc6: 0b010000},
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "I";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;
          ret.a.fnc6 = info.fnc6;


          ret.idFieldName = ["opcode", "fnc3", "fnc6"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "rs1", "imm6"];
          ret.miFieldName = [ // machine instruction format
               "fnc6",
               "imm6",
               "rs1",
               "fnc3",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};

rv64.R = {
     machineInstructions: {
          opCode: 0b0110011,
          info: [
               {mnem: "add",  fnc3: 0b000, fnc7: 0b0000000},
               {mnem: "sub",  fnc3: 0b000, fnc7: 0b0100000},
               {mnem: "sll",  fnc3: 0b001, fnc7: 0b0000000},
               {mnem: "slt",  fnc3: 0b010, fnc7: 0b0000000},
               {mnem: "sltu", fnc3: 0b011, fnc7: 0b0000000},
               {mnem: "xor",  fnc3: 0b100, fnc7: 0b0000000},
               {mnem: "srl",  fnc3: 0b101, fnc7: 0b0000000},
               {mnem: "sra",  fnc3: 0b101, fnc7: 0b0100000},
               {mnem: "or",   fnc3: 0b110, fnc7: 0b0000000},
               {mnem: "and",  fnc3: 0b111, fnc7: 0b0000000},
          ]
     },

     randomInstruction() {
          let ret = {};

          ret.type = "R";

          let idx = Math.trunc(Math.random() * this.machineInstructions.info.length);
          let info = this.machineInstructions.info[idx];

          ret.a = {};
          ret.a.mnem   = info.mnem;
          ret.a.opcode = this.machineInstructions.opCode;
          ret.a.fnc3   = info.fnc3;
          ret.a.fnc7 = info.fnc7;


          ret.idFieldName = ["opcode", "fnc3", "fnc7"];   // CPU identifies instruction
          ret.operandsFieldName =  ["rd", "rs1", "rs2"];
          ret.miFieldName = [ // machine instruction format
               "fnc7",
               "rs2",
               "rs1",
               "fnc3",
               "rd",
               "opcode"
          ];

          ret = fillRandomInstruction(ret);
          return(ret);
     }
};

rv64.types = [rv64.B, rv64.I0, rv64.I1, rv64.I2, rv64.I3,
                rv64.R, rv64.S, rv64.J, rv64.U0, rv64.U1];


function fillRandomInstruction(ret) {

     for (let f of ret.operandsFieldName) {
          switch (f) {

          case "imm20":
               ret.a.imm20 = -(2**19) +
                          Math.trunc(Math.random() * (2**20));
               break;

          case "imm21":
               ret.a.imm21 = (-(2**20) +
                          Math.trunc(Math.random() * (2**21))) * 2;
               break;

          case "imm13":
               ret.a.imm13 = (-2048 + Math.trunc(Math.random() * 4096)) * 2;
               break;

          case "imm12":
               ret.a.imm12 = (-2048 + Math.trunc(Math.random() * 4096));
               break;

          case "imm6":
               ret.a.imm6 = Math.trunc(Math.random() * 64);
               break;

          case "rs1":
          case "rs2":
          case "rd":
               ret.a[f] = Math.trunc(Math.random() * 32);
               break;
          }
     }

     ret["fnc7"] = {
          get bin() {
               return(ret.a.fnc7.toString(2).padStart(7, "0"));
          },

          get num() {
               return (ret.a.fnc7);
          }
     };

     ret["fnc6"] = {
          get bin() {
               return(ret.a.fnc6.toString(2).padStart(6, "0"));
          },

          get num() {
               return (ret.a.fnc6);
          }
     };

     ret["imm21"] = {
          get bin() {
               let n = ret.a.imm21 >= 0?
                         ret.a.imm21 :
                         ret.a.imm21 + (2**21);
               let t = n.toString(2).padStart(21, "0");
               return (t);
          },

          get num() {
               return (ret.a.imm21);
          }
     };

     ret["imm20"] = {
          get bin() {
               let n = ret.a.imm20 >= 0?
                         ret.a.imm20 :
                         ret.a.imm20 + (2**20);
               let t = n.toString(2).padStart(20, "0");
               return (t);
          },

          get num() {
               return (ret.a.imm20);
          }
     };

     ret["imm13"] = {
          get bin() {
               let n = ret.a.imm13 >= 0?
                         ret.a.imm13 :
                         ret.a.imm13 + 8192;
               let t = n.toString(2).padStart(13, "0");
               return (t);
          },

          get num() {
               return (ret.a.imm13);
          }
     };

     ret["imm12"] = {
          get bin() {
               let n = ret.a.imm12 >= 0?
                         ret.a.imm12 :
                         ret.a.imm12 + 4096;
               let t = n.toString(2).padStart(12, "0");
               return (t);
          },

          get num() {
               return (ret.a.imm12);
          }
     };

     ret["imm6"] = {
          get bin() {
               let t = ret.a.imm6.toString(2).padStart(6, "0");
               return (t);
          },

          get num() {
               return (ret.a.imm6);
          }
     };

     ret["imm21[20]"] = {
          get bin() {
               let t = ret.imm21.bin.split("").reverse().join("");
               return (t.substring(20, 21));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };

     ret["imm21[19:12]"] = {
          get bin() {
               let t = ret.imm21.bin.split("").reverse().join("");
               return (t.substring(12, 20).split("").reverse().join(""));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };


     ret["imm21[11]"] = {
          get bin() {
               let t = ret.imm21.bin.split("").reverse().join("");
               return (t.substring(11, 12));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };

      ret["imm21[10:1]"] = {
          get bin() {
               let t = ret.imm21.bin.split("").reverse().join("");
               return (t.substring(1, 11).split("").reverse().join(""));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };
    

     ret["imm13[12]"] = {
          get bin() {
               let t = ret.imm13.bin.split("").reverse().join("");
               return (t.substring(12, 13));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };

     ret["imm13[11]"] = {
          get bin() {
               let t = ret.imm13.bin.split("").reverse().join("");
               return (t.substring(11, 12));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };


     ret["imm13[10:5]"] = {
          get bin() {
               let t = ret.imm13.bin.split("").reverse().join("");
               return (t.substring(5, 11).split("").reverse().join(""));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };

     ret["imm13[4:1]"] = {
          get bin() {
               let t = ret.imm13.bin.split("").reverse().join("");
               return (t.substring(1, 5).split("").reverse().join(""));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t,2));
          }
     };

     ret["imm12[11:5]"] = {
          get bin() {
               let t = ret.imm12.bin.split("").reverse().join("");
               return (t.substring(5, 12).split("").reverse().join(""));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };

     ret["imm12[4:0]"] = {
          get bin() {
               let t = ret.imm12.bin.split("").reverse().join("");
               return (t.substring(0, 5).split("").reverse().join(""));
          },

          get num() {
               let t = this.bin;
               return (parseInt(t, 2));
          }
     };


     ret["rs1"] = {
          get bin() {
               return (ret.a.rs1.toString(2).padStart(5,"0"));
          },

          get num() {
               return (ret.a.rs1);
          },

          get str() {
               let n = ret.a.rs1;
               let s = Math.random() < 0.5 ?
                         "x"+n.toString() :
                         rv64.registerName[n];
               return (s);
          }
     };

     ret["rs2"] = {
          get bin() {
               return (ret.a.rs2.toString(2).padStart(5,"0"));
          },

          get num() {
               return (ret.a.rs2);
          },

          get str() {
               let n = ret.a.rs2;
               let s = Math.random() < 0.5 ?
                         "x"+n.toString() :
                         rv64.registerName[n];
               return (s);
          }
     };

     ret["rd"] = {
          get bin() {
               return (ret.a.rd.toString(2).padStart(5,"0"));
          },

          get num() {
               return (ret.a.rd);
          },

          get str() {
               let n = ret.a.rd;
               let s = Math.random() < 0.5 ?
                         "x"+n.toString() :
                         rv64.registerName[n];
               return (s);
          }
     };


     ret["fnc3"] = {
          get bin() {
               return (ret.a.fnc3.toString(2).padStart(3,"0"));
          },

          get num() {
               return (ret.a.fnc3);
          }
     };

     ret["opcode"] = {
          get bin() {
               return (ret.a.opcode.toString(2).padStart(7,"0"));
          },

          get num() {
               return (ret.a.opcode);
          }
     };


     ret["mnem"] = {
          get bin() {
               return (ret.a.opcode.toString(2).padStart(7,"0"));
          },

          get num() {
               return (ret.a.opcode);
          }
     };

     ret["mi"] = {
          get assembly() {
               let s = `${ret.a.mnem}\t`;
               let args = [];
               for (let f of ret.operandsFieldName) {
                    if (f == "rd") {
                         args.push(`${ret.rd.str}`);
                         break;
                    }
               }
               for (let f of ret.operandsFieldName) {
                    if (f == "rs1") {
                         args.push(`${ret.rs1.str}`);
                         break;
                    }
               }
               for (let f of ret.operandsFieldName) {
                    if (f == "rs2") {
                         args.push(`${ret.rs2.str}`);
                         break;
                    }
               }
               for (let f of ret.operandsFieldName) {
                    if (f.startsWith("imm")) {
                         args.push(`${ret[f].num}`);
                         break;
                    }
               }
               if (typeof(ret.a.memory) != "undefined"  && ret.a.memory) {
                    let f = args.pop();
                    let rs = args.pop();
                    args.push(`${f}(${rs})`);
               }

               return (s + args.join(","));
          },

          get bin() {
               let mi = "";
               for (let f of ret.miFieldName) {
                    mi += ret[f].bin;
               }
               return (mi);
          },

          get num() {
               return(parseInt(this.bin, 2));
          },

          get hex() {
               return(this.num.toString(16).padStart(8, "0").toUpperCase());
          }
     }

     return(ret);
}

