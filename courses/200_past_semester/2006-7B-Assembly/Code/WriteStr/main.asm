    TITLE   WriteStr test
    
    .386
    .model  flat
    
    extern  _ExitProcess@4:Near
    extern  _GetStdHandle@4:Near
    extern  _WriteConsoleA@20:Near
STD_INPUT_HANDLE  EQU -10
STD_OUTPUT_HANDLE EQU -11
.data
String BYTE "Hello world!"
    StrLen=$-String
    
Written DWORD ? 
    .code
_main:
        push    STD_OUTPUT_HANDLE
        call    _GetStdHandle@4

        push    0
        push    OFFSET Written
        push    StrLen
        push    OFFSET String
        push    eax
        call    _WriteConsoleA@20
    
        push    0
        call    _ExitProcess@4
        end     _main