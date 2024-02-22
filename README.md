# Exolve React Native Voice Demo
Предназначение этого приложения показать как использовать [Exolve Mobile Voice SDK](https://www.npmjs.com/package/@exolve/react-native-voice-sdk) NPM пакет под React Native для
интегрирования функциональности телефонных звонков в ваше приложение. Из приложения можно принимать и инициировать телефонные звонки с помощью платформы [Exolve](https://exolve.ru). Для использования функциональности необходимо зарегистрироваться на платформе и получить логин и пароль для доступа к API.

## Предварительно настроенное окружение
Предполагается что предварительно установлены node и yarn. На Macos эти пакеты можно установить с помощью комманд `brew install node` и `brew install yarn`  

## Сборка приложения под iOS
1. Выполнить последовательно команды:
```
yarn install
cd ios
pod update
pod install
```
2. Открыть проект ios/ReactNativeVoiceExample.xcworkspace  в  Xcode
8. Добавить информацию во вкладке "Signing & Capabilities" о подписи приложения
9. Добавить "Push Notifications" во вкладке "Signing & Capabilities" через кнопку "+ Capability"
10. Можно начать собирать проект. Проект можно собрать и для симулятора и для телефона


## Сборка и запуск приложения под Android 

1. Добавить в  ~/.gradle/gradle.properties авторизационные данные для GitHub:
```
gpr.user=YOUR_GITHUB_USERNAME
gpr.key=YOUR_GITHUB_TOKEN
```
2. Выполнить последовательно команды:
```
yarn install
cd android
```
3.  Выполнить команду `./gradlew installFirebaseRelease` для сборки и запуска приложения под Google Play и команду `./gradlew installHmsRelease` для сборки и запуска под AppGallery

###### Credits
Notification icon: pattern by BÖCK from <a href="https://thenounproject.com/browse/icons/term/pattern/" target="_blank" title="pattern Icons">Noun Project</a> (CC BY 3.0)
