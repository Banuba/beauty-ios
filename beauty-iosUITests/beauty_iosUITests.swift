//
//  beauty_iosUITests.swift
//  beauty-iosUITests
//
//  Created by Andrey Krivoshey on 3/10/20.
//  Copyright © 2020 banuba. All rights reserved.
//

import XCTest

class beauty_iosUITests: beauty_iosUITestBase {

    
    func testBeautyModes() {
        let menuButton = app.buttons["menuButton"]
        menuButton.tap()
        
//        Test beauty modes switch
        sleep(1)
        app.pickerWheels["low"].adjust(toPickerWheelValue: "medium")
        
        sleep(1)
        app.pickerWheels["medium"].adjust(toPickerWheelValue: "high")
        takeScreenshot(name: "beauty_high")
        
        sleep(1)
        app.pickerWheels["high"].adjust(toPickerWheelValue: "custom")
        
        sleep(1)
        app.pickerWheels["custom"].adjust(toPickerWheelValue: "medium")
    }
    func testCustomMode() {
        let menuButton = app.buttons["menuButton"]
        let tablesQuery = app.tables
        let collectionViewsQuery = app.collectionViews
        
        menuButton.tap()
        sleep(1)
        app.pickerWheels["low"].adjust(toPickerWheelValue: "custom")
        
//        Test custom mode options
//        Check color option
        sleep(1)
        tablesQuery/*@START_MENU_TOKEN@*/.sliders["beautification.color.alpha"]/*[[".cells.matching(identifier: \"beautyParam\").sliders[\"beautification.color.alpha\"]",".sliders[\"beautification.color.alpha\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.adjust(toNormalizedSliderPosition: 0.8)
        tablesQuery/*@START_MENU_TOKEN@*/.sliders["beautification.color.tex"]/*[[".cells.matching(identifier: \"beautyParam\").sliders[\"beautification.color.tex\"]",".sliders[\"beautification.color.tex\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.adjust(toNormalizedSliderPosition: 0.8)
        takeScreenshot(name: "beauty_color")

//        Check brows option
        sleep(1)
        collectionViewsQuery.staticTexts["brows"].tap()
        sleep(1)
        tablesQuery/*@START_MENU_TOKEN@*/.sliders["beautification.brows.alpha"]/*[[".cells.matching(identifier: \"beautyParam\").sliders[\"beautification.brows.alpha\"]",".sliders[\"beautification.brows.alpha\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.adjust(toNormalizedSliderPosition: 0.5)
        tablesQuery/*@START_MENU_TOKEN@*/.sliders["beautification.brows.tex"]/*[[".cells.matching(identifier: \"beautyParam\").sliders[\"beautification.brows.tex\"]",".sliders[\"beautification.brows.tex\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.adjust(toNormalizedSliderPosition: 0.5)
        takeScreenshot(name: "beauty_brows")

//        Check eyes option
        sleep(1)
        collectionViewsQuery.staticTexts["eyes"].tap()
        sleep(1)
        tablesQuery/*@START_MENU_TOKEN@*/.sliders["beautification.eyes.alpha"]/*[[".cells.matching(identifier: \"beautyParam\").sliders[\"beautification.eyes.alpha\"]",".sliders[\"beautification.eyes.alpha\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.adjust(toNormalizedSliderPosition: 0.9)
        tablesQuery/*@START_MENU_TOKEN@*/.sliders["beautification.eyes.tex"]/*[[".cells.matching(identifier: \"beautyParam\").sliders[\"beautification.eyes.tex\"]",".sliders[\"beautification.eyes.tex\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.adjust(toNormalizedSliderPosition: 1.0)
        takeScreenshot(name: "beauty_eyes")
        
//        Check lashes options
        sleep(1)
        collectionViewsQuery.staticTexts["lashes"].tap()
        sleep(1)
        tablesQuery.sliders["beautification.lashes.alpha"].adjust(toNormalizedSliderPosition: 0.88)
        tablesQuery.sliders["beautification.lashes.tex"].adjust(toNormalizedSliderPosition: 0.7)
        takeScreenshot(name: "beauty_lashes")

//        Swipe till the morph will be visible
        sleep(1)
        collectionViewsQuery.staticTexts["eyes"].swipeLeft()
        collectionViewsQuery.staticTexts["lashes"].swipeLeft()
        
//        Check morph options
        collectionViewsQuery/*@START_MENU_TOKEN@*/.staticTexts["morph"]/*[[".cells.staticTexts[\"morph\"]",".staticTexts[\"morph\"]"],[[[-1,1],[-1,0]]],[0]]@END_MENU_TOKEN@*/.tap()
        sleep(1)
        tablesQuery.sliders["beautification.morph.cheeks"].adjust(toNormalizedSliderPosition: 0.88)
        tablesQuery.sliders["beautification.morph.eyes"].adjust(toNormalizedSliderPosition: 1.0)
        tablesQuery.sliders["beautification.morph.nose"].adjust(toNormalizedSliderPosition: 0.33)
        takeScreenshot(name: "beauty_morph")
        
//        Check skin options
        sleep(1)
        collectionViewsQuery.staticTexts["skin"].tap()
        tablesQuery.sliders["beautification.skin.soft"].adjust(toNormalizedSliderPosition: 0.5)
        tablesQuery.sliders["beautification.skin.alpha"].adjust(toNormalizedSliderPosition: 0.99)
        tablesQuery.sliders["beautification.skin.tex"].adjust(toNormalizedSliderPosition: 0.8)
        takeScreenshot(name: "beauty_skin")
        
//        Check teeth options
        sleep(1)
        collectionViewsQuery.staticTexts["teeth"].tap()
        tablesQuery.sliders["beautification.teeth.Whitening"].adjust(toNormalizedSliderPosition: 1.0)
        takeScreenshot(name: "beauty_teeth")
    }
    func testEffects() {
//        Test Neural Networks Effects
        let menuButton = app.buttons["menuButton"]
        let alphaSlider = app.sliders["alphaSlider"]
        let colorSlider = app.sliders["colorSlider"]
        
        menuButton.tap()
        sleep(1)

        app.pickerWheels["beauty"].adjust(toPickerWheelValue: "eyes")
        colorSlider.adjust(toNormalizedSliderPosition: 0.8)
        alphaSlider.adjust(toNormalizedSliderPosition: 0.9)
        takeScreenshot(name: "effect_eyes")

        app.pickerWheels["eyes"].adjust(toPickerWheelValue: "hair")
        colorSlider.adjust(toNormalizedSliderPosition: 0.25)
        alphaSlider.adjust(toNormalizedSliderPosition: 0.77)
        takeScreenshot(name: "effect_hair")

        app.pickerWheels["hair"].adjust(toPickerWheelValue: "lips")
        colorSlider.adjust(toNormalizedSliderPosition: 0.99)
        alphaSlider.adjust(toNormalizedSliderPosition: 1.0)
        takeScreenshot(name: "effect_lips")

        app.pickerWheels["lips"].adjust(toPickerWheelValue: "lipsShine")
        colorSlider.adjust(toNormalizedSliderPosition: 0.3)
        alphaSlider.adjust(toNormalizedSliderPosition: 0.25)
        takeScreenshot(name: "effect_lips_shine")
        
        app.pickerWheels["lipsShine"].adjust(toPickerWheelValue: "skin")
        colorSlider.adjust(toNormalizedSliderPosition: 1.0)
        alphaSlider.adjust(toNormalizedSliderPosition: 0.5)
        takeScreenshot(name: "effect_skin")

        menuButton.tap()
    }
}
