# todo-app

This project contains a Maven application with [AWS Java SDK 2.x](https://github.com/aws/aws-sdk-java-v2) dependencies.

## Prerequisites
- Java 1.8+
- Apache Maven
- GraalVM Native Image (optional)

## Development

Below is the structure of the generated project.

├── src │   ├── main │   │   ├── java │   │   │   └── package │   │   │   ├── App.java │   │   │   ├── DependencyFactory.java │   │   │   └── Handler.java │   │   └── resources │   │   └── simplelogger.properties │   └── test │   └── java │   └── package │   └── HandlerTest.java

markdown
Copy
Edit



- `App.java`: main entry of the application  
- `DependencyFactory.java`: creates the SDK client  
- `Handler.java`: you can invoke the API calls using the SDK client here.

### Building the project
```bash
mvn clean package



---

### ✅ Then Run:
After saving the fixed file:

```bash
git add README.md
git rebase --continue
