import Foundation
import Translation

private let source = Locale.Language(identifier: "en")
private let target = Locale.Language(identifier: "th")
private let notInstalledMessage = """
Thai translation is not downloaded.
Open System Settings > General > Language & Region > Translation Languages…
and download Thai. Then run this script again.
"""

@main
struct TranslateThai {
    static func main() async {
        let arguments = Array(CommandLine.arguments.dropFirst())
        if arguments == ["--check"] {
            await check()
            return
        }

        let text = (String(data: FileHandle.standardInput.readDataToEndOfFile(), encoding: .utf8) ?? "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        if text.isEmpty {
            fail("no text to translate")
        }
        if text.count > 500 {
            fail("phrase is longer than 500 characters")
        }

        let session = TranslationSession(installedSource: source, target: target)
        do {
            let result = try await session.translate(text)
            let thai = result.targetText.trimmingCharacters(in: .whitespacesAndNewlines)
            if thai.isEmpty {
                fail("empty translation")
            }
            print(thai)
        } catch TranslationError.notInstalled {
            fail(notInstalledMessage)
        } catch {
            fail(error.localizedDescription)
        }
    }

    static func check() async {
        let status = await LanguageAvailability().status(from: source, to: target)
        switch status {
        case .installed:
            return
        case .supported:
            fail(notInstalledMessage)
        case .unsupported:
            fail("This Mac cannot translate from English to Thai.")
        @unknown default:
            fail("Unknown translation language status.")
        }
    }

    static func fail(_ message: String) -> Never {
        fputs(message + "\n", stderr)
        exit(1)
    }
}
