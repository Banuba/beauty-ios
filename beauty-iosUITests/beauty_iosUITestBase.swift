//
//  beauty_iosUITestBase.swift
//  beauty-iosUITests
//
//  Created by Andrey Krivoshey on 3/10/20.
//  Copyright © 2020 banuba. All rights reserved.
//

import XCTest

class beauty_iosUITestBase: XCTestCase {
    var app: XCUIApplication!
        
    let defaultLaunchArgs: [[String]] = {
        let launchArgs: [[String]] = [["-StartFromCleanState", "YES"]]
        return launchArgs
    }()
    
    func launchApp(with launchArgs: [[String]] = []) {
        (defaultLaunchArgs + launchArgs).forEach { app.launchArguments += $0 }
        app.launch()
    }

    override func setUp() {
        app = XCUIApplication()
        super.setUp()
        continueAfterFailure = false
        launchApp(with: defaultLaunchArgs)
    }

    override func tearDown() {
        app.terminate()
        super.tearDown()
    }

    func testLaunchPerformance() {
        if #available(macOS 10.15, iOS 13.0, tvOS 13.0, *) {
            // This measures how long it takes to launch your application.
            measure(metrics: [XCTOSSignpostMetric.applicationLaunch]) {
                XCUIApplication().launch()
            }
        }
    }
    
    func takeScreenshot(name: String) {
      let fullScreenshot = XCUIScreen.main.screenshot()

      let screenshot = XCTAttachment(uniformTypeIdentifier: "public.png", name: "Screenshot-\(name)-\(UIDevice.current.name).png", payload: fullScreenshot.pngRepresentation, userInfo: nil)
      screenshot.lifetime = .keepAlways
      add(screenshot)
    }
}
