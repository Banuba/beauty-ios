import UIKit

private struct Defaults {
    static var pickerData: [EffectTypes] { EffectTypes.allCases }
}

enum EffectTypes: String, CaseIterable {
    case beauty
    case eyes
    case hair
    case lips
    case lipsShine
    case skin
}

class EffectPickerHandler: NSObject {
    private var pickerView: UIPickerView
    var didSelectRow: ((EffectTypes) -> Void)?
    
    init(pickerView: UIPickerView) {
        self.pickerView = pickerView
        super.init()
        
        pickerView.dataSource = self
        pickerView.delegate = self
    }
}

extension EffectPickerHandler: UIPickerViewDataSource, UIPickerViewDelegate {
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        let effectId = Defaults.pickerData[row]
        didSelectRow?(effectId)
    }
    
    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        let pickerLabel = UILabel()
        
        pickerLabel.text = Defaults.pickerData[row].rawValue
        pickerLabel.font = .systemFont(ofSize: 26, weight: .bold)
        pickerLabel.textAlignment = .center
        pickerLabel.textColor = .white
        
        return pickerLabel
    }
    
    func pickerView(_ pickerView: UIPickerView,  numberOfRowsInComponent component: Int) -> Int {
        Defaults.pickerData.count
    }
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        1
    }
}
