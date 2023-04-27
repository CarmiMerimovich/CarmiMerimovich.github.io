	TITLE	WriteStr
	
	.386
	.model	flat

	include	WinCon.inc

	.data
Outhandle	DWORD	0
Written		DWORD	?
	.code
WriteStr Proc
StrPtr=8
Len=StrPtr+4
	push	ebp
	mov		ebp,esp
	
	cmp		OutHandle,0
	jne		SkipHandle

	push	STD_OUTPUT_HANDLE
	call	_GetStdHandle@4
	mov		OutHandle,eax
SkipHandle:
	push	0
	push	OFFSET Written
	push	Len[ebp]
	push	StrPtr[ebp]
	push	OutHandle
	call	_WriteConsoleA@20
	
	pop		ebp
	ret		8
WriteStr Endp
	end