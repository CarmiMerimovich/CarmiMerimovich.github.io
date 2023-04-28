        TITLE   Main    (Binary tree class)
        .386
        .model  flat

        include WinCon.inc
        extern  BinTreeShow:Near, NodeDWORD:Near, NodeSTR:Near
        .data
Tree1   DWORD   NodeDWORD, Two, Seven, 5
Seven   DWORD   NodeDWORD,   0,     0, 7
Two     DWORD   NodeDWORD, One, Three, 2
One     DWORD   NodeDWORD,   0,     0, 1
Three   DWORD   NodeDWORD,   0,     0, 3

Tree2   DWORD   NodeSTR, Menachem, Sy
        BYTE    'Moti',0

Sy      DWORD   NodeSTR, 0, 0
        BYTE    'Sy',0

Andreas DWORD   NodeSTR, 0, 0
        BYTE    'Andreas',0

Bill    DWORD   NodeSTR, 0, 0
        BYTE    'Bill',0

Menachem DWORD  NodeSTR, Asaf, Bill
        BYTE    'Menachem',0

Asaf    DWORD   NodeSTR, Andreas, 0
        BYTE    'Asaf',0

        .code
_main:
        push    OFFSET Tree1    ;SAME CALLS AS IN THE ORIGINAL BINTREE
        call    BinTreeShow
    
        push    OFFSET Tree2
        call    BinTreeShow

        push    0
        call    ExitProcess
        end      _main