        TITLE   Main    (Binary tree with address of show routine)
        .386
        .model  flat

        include WinCon.inc
        extern  BinTreeShow:Near, NodeDWORD:Near, NodeSTR:Near
        .data
Tree1   DWORD   Two, Seven, 5
Seven   DWORD     0,     0, 7
Two     DWORD   One, Three, 2
One     DWORD     0,     0, 1
Three   DWORD     0,     0, 3

Tree2   DWORD   Menachem, Sy
        BYTE    'Moti',0

Sy      DWORD   0, 0
        BYTE    'Sy',0

Andreas DWORD   0, 0
        BYTE    'Andreas',0

Bill    DWORD   0, 0
        BYTE    'Bill',0

Menachem DWORD  Asaf, Bill
        BYTE    'Menachem',0

Asaf    DWORD   Andreas, 0
        BYTE    'Asaf',0

        .code
_main:
        push    OFFSET NodeDWORD    ;ADDRESS OF SHOW ROUTINE
        push    OFFSET Tree1
        call    BinTreeShow
    
        push    OFFSET NodeSTR      ;ADDRESS OF SHOW ROUTINE
        push    OFFSET Tree2
        call    BinTreeShow

        push    0
        call    ExitProcess
        end _main