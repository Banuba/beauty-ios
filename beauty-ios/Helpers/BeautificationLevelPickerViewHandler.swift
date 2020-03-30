import UIKit

private struct Defaults {
    static var beautificationLevels: [BeautificationLevels] { BeautificationLevels.allCases }
    
    static var beautyData: [BeautificationLevels: String] { [
        BeautificationLevels.low: "low",
        BeautificationLevels.medium: "medium",
        BeautificationLevels.high: "high",
        BeautificationLevels.custom: "custom"
        ]
    }
}

enum BeautificationLevels: Double, CaseIterable {
    case low = 1
    case medium = 1.5
    case high = 2
    case custom = 0
}

class BeautificationLevelPickerHandler: NSObject {
    private var pickerView: UIPickerView
    var didSelectRow: ((BeautificationLevels) -> Void)?
    
    init(pickerView: UIPickerView) {
        self.pickerView = pickerView
        super.init()
        
        pickerView.dataSource = self
        pickerView.delegate = self
    }
}

extension BeautificationLevelPickerHandler: UIPickerViewDataSource, UIPickerViewDelegate {
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        let degree = Defaults.beautificationLevels[row]
        didSelectRow?(degree)
    }
    
    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        let pickerLabel = UILabel()
    
        let BeautificationLevel = Defaults.beautificationLevels[row]
        pickerLabel.text = Defaults.beautyData[BeautificationLevel]
           
        pickerLabel.font = .systemFont(ofSize: 26, weight: .bold)
        pickerLabel.textAlignment = .center
        pickerLabel.textColor = .white
        return pickerLabel
    }
    
    func pickerView(_ pickerView: UIPickerView,  numberOfRowsInComponent component: Int) -> Int {
        Defaults.beautificationLevels.count
    }
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        1
    }
}
