cls
@echo off
chcp 1252>nul

rem pegando a pasta pai (parentFolder)
for %%i in ("%~dp0..") do set "parentFolder=%%~fi"

set serviceId="mktAgendaWinService"
set serviceAppPath="node"
set serviceDir="%parentFolder%"
set serviceScriptParam="%serviceDir%\node-server.js"
set serviceDisplayName="MKT - Agenda WinService"
set serviceDescription="Servi�o que roda o server da aplica��o agenda"

nssm stop %serviceId% >nul 2>nul
nssm remove %serviceId% confirm >nul 2>nul

echo ------------------------------------------------------
echo Criando o servi�o %serviceId% - %serviceDisplayName%
echo ------------------------------------------------------

nssm install %serviceId% %serviceAppPath% %serviceDir%
nssm set %serviceId% AppDirectory %serviceDir%
nssm set %serviceId% AppParameters %serviceScriptParam%
nssm set %serviceId% DisplayName %serviceDisplayName%
nssm set %serviceId% Description %serviceDescription%
nssm set %serviceId% Start SERVICE_AUTO_START
nssm start %serviceId%

echo ------------------------------------------------------
echo Servi�o %serviceId% - %serviceDisplayName% criado
echo ------------------------------------------------------

pause