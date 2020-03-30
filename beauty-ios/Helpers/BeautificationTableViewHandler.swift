import Foundation
import UIKit

struct SliderConfig {
    var title: String
    var type: String
    
    var currentValue: Float
    var maxValue: Float
    
    var shouldValueRounded: Bool
    var identifier: String
}

class SliderTableViewCell: UITableViewCell {
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var slider: UISlider!
    
    var valueChanged: ((String, Float) -> Void)?
    
    private var effectType: String?
    private var shouldValueRounded: Bool?
    
    func setup(config: SliderConfig) {
        shouldValueRounded = config.shouldValueRounded
        effectType = config.type
        titleLabel.text = config.title
        
        slider.accessibilityIdentifier = config.identifier
        slider.value = config.currentValue
        slider.maximumValue = config.maxValue
        slider.minimumValue = .zero
    }
    
    @IBAction func valueChanged(_ sender: UISlider) {
        guard let effectType = effectType,
            let shouldValueRounded = shouldValueRounded else { return }
        let value = shouldValueRounded ? sender.value.rounded() : sender.value
        valueChanged?(effectType, value)
    }
}

class BeautificationTableViewHandler: NSObject {
    private var tableView: UITableView
    private var slidersConfig = [SliderConfig]()
    
    var valueChanged: ((String, Float) -> Void)?
    
    init(tableView: UITableView) {
        self.tableView = tableView
        super.init()
        
        tableView.delegate = self
        tableView.dataSource = self
    }
    
    func applyConfig(_ slidersConfig: [SliderConfig]) {
        self.slidersConfig = slidersConfig
        self.tableView.reloadData()
    }
}

extension BeautificationTableViewHandler: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return slidersConfig.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "SliderTableViewCell", for: indexPath) as! SliderTableViewCell
        let sliderConfig = slidersConfig[indexPath.row]
        
        cell.setup(config: sliderConfig)
        cell.valueChanged = valueChanged
        return cell
    }
}
