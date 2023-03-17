         TITLE D2strN Convert DWORD to Null-terminated radix-N string

         .386
         .model flat

		extern	_ExitProcess@4:Near

        .data
String  BYTE    33 DUP(?)

        .code
_main:
        push    OFFSET String ;Address of result
		push	2			  ;Radix
        push    0FFFFFFFFh    ;Maximal value
        call    D2StrN        ;Call the conversion procedure

		push	0
		call	_ExitProcess@4
;
; D2StrN(unsigned int d, int N, char *StrPtr)
; Input parameters:
;               d        DWORD to convert
;				N		 DWORD base to convert to
; Output parameters:
;               StrPtr   Points to empty place
;
D2strN:
D   = 8
N   = D + 4
StrPtr = N + 4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    ecx             ;Saving registers we use
        push    edx

        mov     ecx,0           ;Counter for number of digits
        mov     eax,D[ebp]      ;Get the DWORD
NextDigit:
        mov     edx,0           ;Prepare to DIV
        
        div     DWORD PTR N[ebp] ;Divide by N

        add     edx,'0'         ;Convert the digit to ASCII
		cmp		edx,'9'			;Do we need to convert to Letters?
		jle		DigitsOK		;No, digits OK
		add		edx,'A'-10-'0'	;Convert to Letter
DigitsOK:
        push    dx              ;And save it on stack. (We get the digits in reverse)
        inc     ecx             ;Update digits counter
        
        cmp     eax,0           ;Have we finished?
        jne     NextDigit       ;No. Contiue to next digit.
                                ;Yes.
        mov     eax,StrPtr[ebp] ;Get the string pointer
NextPop:
        pop     dx              ;Pop digit
        mov     [eax],dl        ;Store digit into string
        inc     eax              ;Point to next place
        loop    NextPop         ;Do this for all digits

        mov     BYTE PTR [eax],0;Add the terminating null

        pop     edx             ;Restore registers
        pop     ecx

        pop     ebp

        ret     12

        end   _main

