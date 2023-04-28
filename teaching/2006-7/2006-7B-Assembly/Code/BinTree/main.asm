        TITLE   Main    (Binary tree of DWORDs)
        .386
        .model  flat

        include WinCon.inc
        extern  BinTreeShow:Near
        .data
Tree    DWORD   Two, Seven, 5            ;statically defined binary tree
Seven   DWORD     0,     0, 7
Two     DWORD   One, Three, 2
One     DWORD     0,     0, 1
Three   DWORD     0,     0, 3
        .code
_main:
        push    OFFSET Tree
        call    BinTreeShow
    
        push    0
        call    ExitProcess
        end		_main