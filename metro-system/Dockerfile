# ---- STAGE 1: Build ----
FROM eclipse-temurin:21.0.2_13-jdk-jammy AS builder
WORKDIR /app

# Copy Maven wrapper & project files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
COPY ./src ./src
RUN ./mvnw clean install

# ---- STAGE 2: RUN ----
FROM eclipse-temurin:21.0.2_13-jre-jammy AS final
WORKDIR /app
COPY --from=builder app/target/metro-system-0.0.1-SNAPSHOT.jar /app/metro-system-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/metro-system-0.0.1-SNAPSHOT.jar"]