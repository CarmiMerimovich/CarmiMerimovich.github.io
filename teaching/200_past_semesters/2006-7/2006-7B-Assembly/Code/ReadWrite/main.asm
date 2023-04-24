        TITLE   Main
    
        .386
        .model  flat
    
        include WinCon.inc
    
        extern  ReadStr:Near, WriteStr:Near
    
        .data
buffer  BYTE    80 dup(?)
read    DWORD   ?
        .code
_main:
        push    OFFSET read
        push    LENGTHOF buffer
        push    OFFSET buffer
        call    ReadStr
    
        push    read
        push    OFFSET buffer
        call    WriteStr

        push    0
        call    ExitProcess
        end     _main