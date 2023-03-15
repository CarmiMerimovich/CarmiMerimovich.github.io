STD_INPUT_HANDLE  EQU -10       ;Win API constants
STD_OUTPUT_HANDLE EQU -11

GetStdHandle    equ <_GetStdHandle@4>
WriteConsole    equ <_WriteConsoleA@20>
ReadConsole     equ <_ReadConsoleA@20>
ExitProcess     equ <_ExitProcess@4>

        extern  ExitProcess:Near
        extern  GetStdHandle:Near
        extern  WriteConsole:Near
        extern  ReadConsole:Near
