@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------
@IF "%__MAVEN_CMD_LINE_ARGS__%" == "" SET "__MAVEN_CMD_LINE_ARGS__=%*"
@SET MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory=%__MULTIMODULE_MVN_HOME__%
@IF "%JAVA_HOME%"=="" (
  @echo Error: JAVA_HOME not found in your environment. >&2
  @goto error
)
@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties") DO (
  @IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)
@IF NOT EXIST %WRAPPER_JAR% (
  @echo Downloading Maven Wrapper...
  @powershell -Command "&{[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%WRAPPER_JAR%'}"
)
@%JAVA_HOME%\bin\java -cp %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
@goto end
:error
@exit /b 1
:end
@IF "%MAVEN_SKIP_RC%"=="" GOTO skipRcPost
