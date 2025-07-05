FROM openjdk:21-jdk-slim

WORKDIR /app

# Copiar o arquivo pom.xml
COPY pom.xml .

# Copiar o wrapper do Maven
COPY mvnw .
COPY .mvn .mvn

# Dar permissão de execução ao wrapper
RUN chmod +x mvnw

# Baixar dependências
RUN ./mvnw dependency:go-offline -B

# Copiar o código fonte
COPY src ./src

# Compilar e criar o JAR
RUN ./mvnw clean package -DskipTests

# Expor a porta
EXPOSE 8080

# Comando para executar a aplicação
CMD ["java", "-jar", "target/erp-0.0.1-SNAPSHOT.jar"] 