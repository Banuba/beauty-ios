import Foundation
import UIKit
import BanubaEffectPlayer
import BanubaSdk

private struct Defaults {
    static var sliderCellHeight: CGFloat = 45
    
    static var effects: [EffectTypes: String] { [
        EffectTypes.beauty: "Beauty_base",
        EffectTypes.eyes: "test_Eyes",
        EffectTypes.hair: "test_Hair",
        EffectTypes.lips: "test_Lips",
        EffectTypes.lipsShine: "test_Lips_shine",
        EffectTypes.skin: "test_Skin",
        ]
    }
    
    static var colorArray: [UIColor] {
        [
            #colorLiteral(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0),
            #colorLiteral(red: 0.2588235438, green: 0.7568627596, blue: 0.9686274529, alpha: 1),
            #colorLiteral(red: 0.3647058904, green: 0.06666667014, blue: 0.9686274529, alpha: 1),
            #colorLiteral(red: 0.8549019694, green: 0.250980407, blue: 0.4784313738, alpha: 1),
            #colorLiteral(red: 0.9411764741, green: 0.4980392158, blue: 0.3529411852, alpha: 1),
            #colorLiteral(red: 0.9686274529, green: 0.78039217, blue: 0.3450980484, alpha: 1),
            #colorLiteral(red: 0.721568644, green: 0.8862745166, blue: 0.5921568871, alpha: 1),
            #colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)
        ]
    }
}

class CameraViewController: UIViewController {
    @IBOutlet weak var menuTrailingPosition: NSLayoutConstraint!
    
    @IBOutlet weak var beautificationTableView: UITableView!
    @IBOutlet weak var beautyTypesCollectionView: UICollectionView!
    @IBOutlet weak var effectPickerView: UIPickerView!
    @IBOutlet weak var BeautificationLevelPickerView: UIPickerView!
    
    @IBOutlet weak var bottomAreaBackground: UIView!
    @IBOutlet weak var effectView: EffectPlayerView!
    @IBOutlet weak var menuView: UIView!
    
    @IBOutlet weak var alphaLabel: UILabel!
    @IBOutlet weak var colorLabel: UILabel!
    
    @IBOutlet weak var alphaSlider: UISlider!
    @IBOutlet weak var colorSlider: UISlider!
    
    @IBOutlet weak var beautificationTableViewHeight: NSLayoutConstraint!
    
    private var effectPickerHandler: EffectPickerHandler?
    private var beautificationLevelPickerHandler: BeautificationLevelPickerHandler?
    private var beautyCollectionViewHandler: BeautyCollectionViewHandler?
    private var beautificationTableViewHandler: BeautificationTableViewHandler?
    
    private var sdkManager = BanubaSdkManager()
    private var isMenuOpen = false
    
    private var currentEffectId: EffectTypes = .beauty
    private var currentBeautificationLevel: BeautificationLevels = .low
    private var currentEffect: BNBEffect? = nil
    
    private var beautyParametrs = [String: Float]()
    
    private var currentAlpha: Float = .zero
    private var currentColor: UIColor = .black {
        didSet {
            colorSlider.tintColor = currentColor
        }
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupHandlers()
        setupUI()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        setupSDKManager()
    }
    
    private func setupSDKManager() {
        sdkManager.setup(configuration: EffectPlayerConfinguration(renderMode: .video))
        effectView?.effectPlayer = sdkManager.effectPlayer

        sdkManager.setRenderTarget(layer: effectView?.layer as! CAEAGLLayer, playerConfiguration: nil)
        currentEffect = sdkManager.loadEffect(Defaults.effects[.beauty]!)
        
        sdkManager.input.startCamera()
        sdkManager.startEffectPlayer()
    }
    
    private func setupUI() {
        menuTrailingPosition.constant = -view.frame.width
        menuView.alpha = .zero
        
        currentColor = Defaults.colorArray[Int(colorSlider.value)]
        currentAlpha = alphaSlider.value
    }
    
    private func setupHandlers() {
        beautificationTableViewHandler = BeautificationTableViewHandler(tableView: beautificationTableView)
        beautificationTableViewHandler?.valueChanged = { [weak self] type, value in
            guard let self = self else { return }
            self.beautyParametrs.updateValue(value, forKey: type)
            self.applyBeautyParams()
        }
        
        beautyCollectionViewHandler = BeautyCollectionViewHandler(collectionView: beautyTypesCollectionView)
        beautyCollectionViewHandler?.didSelectItem = { [weak self] beautyType in
            guard let self = self else { return }
            self.applyConfig(withType: beautyType)
        }
        
        beautificationLevelPickerHandler = BeautificationLevelPickerHandler(pickerView: BeautificationLevelPickerView)
        beautificationLevelPickerHandler?.didSelectRow = { [weak self] BeautificationLevel in
            guard let self = self else { return }
            self.currentBeautificationLevel = BeautificationLevel
            self.currentEffect?.callJsMethod("onDataUpdate", params: "\(BeautificationLevel.rawValue)")
            
            let controls = self.getControlsForDegreePickerAction()
            self.updateControls(visibleControls: controls.visibleControls, hiddenControls: controls.hiddenControls)
            
            if BeautificationLevel == .custom {
                self.setupBeautyParamsIfNeeded()
                self.applyConfig(withType: .color)
            }
        }
        
        effectPickerHandler = EffectPickerHandler(pickerView: effectPickerView)
        effectPickerHandler?.didSelectRow = { [weak self] effectId in
            guard let self = self else { return }
            self.currentEffectId = effectId
            
            let currentEffect = Defaults.effects[effectId]!
            let controls = self.getControlsForEffectPickerAction()
            
            self.currentEffect = self.sdkManager.loadEffect(currentEffect)
            self.updateControls(visibleControls: controls.visibleControls, hiddenControls: controls.hiddenControls)
            
            if effectId != .beauty {
                let colorString = self.currentColor.getColorStringRepresentation(withAlpha: self.currentAlpha)
                self.currentEffect?.callJsMethod("setColor", params: colorString)
            }
        }
    }
}

// MARK:- Actions
extension CameraViewController {
    @IBAction func menuButtonTapped(_ sender: UIButton) {
        isMenuOpen = !isMenuOpen
        setMenu(isHidden: !isMenuOpen)
    }
    
    @IBAction func colorChangeAction(_ sender: UISlider) {
        let currentColor = Defaults.colorArray[Int(sender.value)]
        self.currentColor = currentColor
        
        let colorString = self.currentColor.getColorStringRepresentation(withAlpha: self.currentAlpha)
        self.currentEffect?.callJsMethod("setColor", params: colorString)
    }
    
    @IBAction func alphaChangeAction(_ sender: UISlider) {
        currentAlpha = sender.value
        
        let colorString = self.currentColor.getColorStringRepresentation(withAlpha: self.currentAlpha)
        self.currentEffect?.callJsMethod("setColor", params: colorString)
    }
}

// MARK:- Animations
extension CameraViewController {
    private func updateControls(visibleControls: [UIView], hiddenControls: [UIView]) {
        let animation = {
            visibleControls.forEach { $0.alpha = 1 }
            hiddenControls.forEach { $0.alpha = 0 }
        }
        UIView.animate(
            withDuration: 0.3,
            delay: .zero,
            options: [.beginFromCurrentState, .curveEaseOut],
            animations: animation,
            completion: nil
        )
    }
    
    private func setMenu(isHidden: Bool) {
        let menuTrailingConstant = isHidden ? -view.frame.width : 0
        let alpha: CGFloat = isHidden ? 0 : 1
        
        let animation = {
            self.menuTrailingPosition.constant = menuTrailingConstant
            self.menuView.alpha = alpha
            self.view.layoutIfNeeded()
        }
        UIView.animate(
            withDuration: 0.3,
            delay: .zero,
            options: [.beginFromCurrentState, .curveEaseOut],
            animations: animation
        ) { [weak self] success in
            guard let self = self, success else { return }
            
            let controls = self.getControlsForMenuAction(isMenuHidden: isHidden)
            self.updateControls(visibleControls: controls.visibleControls, hiddenControls: controls.hiddenControls)
        }
    }
}

// MARK:- Controls
extension CameraViewController {
    private func getControlsForDegreePickerAction() -> (visibleControls: [UIView], hiddenControls: [UIView]) {
        var hiddenControls = [UIView]()
        var visibleControls = [UIView]()
        
        if currentBeautificationLevel == .custom {
            visibleControls = [
                self.beautificationTableView,
                self.BeautificationLevelPickerView,
                self.beautyTypesCollectionView,
                self.bottomAreaBackground
            ]
            hiddenControls = [
                self.colorSlider,
                self.alphaSlider,
                self.alphaLabel,
                self.colorLabel
            ]
        } else {
            visibleControls = [
                self.BeautificationLevelPickerView,
            ]
            hiddenControls = [
                self.colorSlider,
                self.alphaSlider,
                self.alphaLabel,
                self.colorLabel,
                self.beautificationTableView,
                self.beautyTypesCollectionView,
                self.bottomAreaBackground
            ]
        }
        return (visibleControls,hiddenControls)
    }
    
    private func getControlsForEffectPickerAction() -> (visibleControls: [UIView],hiddenControls: [UIView]) {
        var hiddenControls: [UIView]
        var visibleControls: [UIView]
        
        if currentEffectId == .beauty {
            visibleControls = [
                self.BeautificationLevelPickerView,
            ]
            hiddenControls = [
                self.colorSlider,
                self.alphaSlider,
                self.alphaLabel,
                self.colorLabel
            ]
            if self.currentBeautificationLevel == .custom {
                visibleControls.append(self.beautificationTableView)
                visibleControls.append(self.beautyTypesCollectionView)
                visibleControls.append(self.bottomAreaBackground)
            } else {
                hiddenControls.append(self.beautificationTableView)
                hiddenControls.append(self.beautyTypesCollectionView)
                hiddenControls.append(self.bottomAreaBackground)
            }
        } else {
            visibleControls = [
                self.colorSlider,
                self.alphaSlider,
                self.alphaLabel,
                self.colorLabel
            ]
            hiddenControls = [
                self.BeautificationLevelPickerView,
                self.beautyTypesCollectionView,
                self.bottomAreaBackground,
                self.beautificationTableView
            ]
        }
        return (visibleControls,hiddenControls)
    }
    
    private func getControlsForMenuAction(isMenuHidden: Bool) -> (visibleControls: [UIView],hiddenControls: [UIView]) {
        var hiddenControls: [UIView]
        var visibleControls: [UIView]
        
        if self.currentEffectId == .beauty {
            visibleControls = [
                self.BeautificationLevelPickerView
            ]
            hiddenControls = [
                self.colorSlider,
                self.alphaSlider,
                self.alphaLabel,
                self.colorLabel
            ]
            if self.currentBeautificationLevel == .custom {
                visibleControls.append(self.beautificationTableView)
                visibleControls.append(self.beautyTypesCollectionView)
                visibleControls.append(self.bottomAreaBackground)
            } else {
                hiddenControls.append(self.beautificationTableView)
                hiddenControls.append(self.beautyTypesCollectionView)
                hiddenControls.append(self.bottomAreaBackground)
            }
        } else {
            visibleControls = [
                self.colorSlider,
                self.alphaSlider,
                self.alphaLabel,
                self.colorLabel
            ]
            hiddenControls = [
                self.beautyTypesCollectionView,
                self.bottomAreaBackground,
                self.BeautificationLevelPickerView,
                self.beautificationTableView
            ]
        }
        return (visibleControls,hiddenControls)
    }
}

// MARK:- BeautyParams
extension CameraViewController {
    private func applyBeautyParams() {
        let params = self.getBeautyParamsStringRepresentation()
        self.currentEffect?.callJsMethod("onDataUpdate", params: params)
    }
    
    private func getBeautyParamsStringRepresentation() -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        let data = try! encoder.encode(beautyParametrs)
        let string = String(data: data, encoding: .utf8)
        return string!
    }
    
    private func setupBeautyParamsIfNeeded() {
        guard beautyParametrs.isEmpty else {
            applyBeautyParams()
            return
        }
        beautyParametrs.updateValue(.zero, forKey: "morph_cheeks_str");
        beautyParametrs.updateValue(.zero, forKey: "morph_eyes_str");
        beautyParametrs.updateValue(.zero, forKey: "morph_nose_str");
        beautyParametrs.updateValue(.zero, forKey: "skin_soft_str");
        beautyParametrs.updateValue(.zero, forKey: "softlight_alpha");
        beautyParametrs.updateValue(.zero, forKey: "softlight_tex");
        beautyParametrs.updateValue(.zero, forKey: "eye_flare_alpha");
        beautyParametrs.updateValue(.zero, forKey: "eyes_coloring_str");
        beautyParametrs.updateValue(.zero, forKey: "teeth_whitening_str");
        beautyParametrs.updateValue(.zero, forKey: "lashes_tex");
        beautyParametrs.updateValue(.zero, forKey: "lashes_alpha");
        beautyParametrs.updateValue(.zero, forKey: "eyebrows_tex");
        beautyParametrs.updateValue(.zero, forKey: "eyebrows_alpha");
        beautyParametrs.updateValue(.zero, forKey: "final_color_correction_str");
        beautyParametrs.updateValue(.zero, forKey: "final_color_correction_tex");
    }
}

// MARK:- ControlsConfig
extension CameraViewController {
    private func applyConfig(withType type: BeautyTypes) {
        var configs = [SliderConfig]()
        
        switch type {
        case .brows:
            let currentAlpha = beautyParametrs["eyebrows_alpha"] ?? .zero
            let currentTex = beautyParametrs["eyebrows_tex"] ?? .zero
            
            let alphaSlider = SliderConfig(title: "Alpha", type: "eyebrows_alpha", currentValue: currentAlpha, maxValue: 1, shouldValueRounded: false, identifier: "beautification.brows.alpha")
            let texSlider = SliderConfig(title: "Tex", type: "eyebrows_tex", currentValue: currentTex, maxValue: 10, shouldValueRounded: true, identifier: "beautification.brows.tex")
            
            configs.append(alphaSlider)
            configs.append(texSlider)
        case .color:
            let currentAlpha = beautyParametrs["final_color_correction_str"] ?? .zero
            let currentTex = beautyParametrs["final_color_correction_tex"] ?? .zero
            
            let alphaSlider = SliderConfig(title: "Intensity", type: "final_color_correction_str", currentValue: currentAlpha, maxValue: 2, shouldValueRounded: false, identifier: "beautification.color.alpha")
            let texSlider = SliderConfig(title: "Tex", type: "final_color_correction_tex", currentValue: currentTex, maxValue: 10, shouldValueRounded: true, identifier: "beautification.color.tex")
            
            configs.append(alphaSlider)
            configs.append(texSlider)
        case .eyes:
            let currentAlpha = beautyParametrs["eye_flare_alpha"] ?? .zero
            let currentTex = beautyParametrs["eyes_coloring_str"] ?? .zero
            
            let alphaSlider = SliderConfig(title: "Flare", type: "eye_flare_alpha", currentValue: currentAlpha, maxValue: 1, shouldValueRounded: false, identifier: "beautification.eyes.alpha")
            let texSlider = SliderConfig(title: "Coloring", type: "eyes_coloring_str", currentValue: currentTex, maxValue: 2, shouldValueRounded: false, identifier: "beautification.eyes.tex")
            
            configs.append(alphaSlider)
            configs.append(texSlider)
        case .lashes:
            let currentAlpha = beautyParametrs["lashes_alpha"] ?? .zero
            let currentTex = beautyParametrs["lashes_tex"] ?? .zero
            
            let alphaSlider = SliderConfig(title: "Alpha", type: "lashes_alpha", currentValue: currentAlpha, maxValue: 1, shouldValueRounded: false, identifier: "beautification.lashes.alpha")
            let texSlider = SliderConfig(title: "Tex", type: "lashes_tex", currentValue: currentTex, maxValue: 12, shouldValueRounded: true, identifier: "beautification.lashes.tex")
            
            configs.append(alphaSlider)
            configs.append(texSlider)
        case .morph:
            let currentCheeks = beautyParametrs["morph_cheeks_str"] ?? .zero
            let currentEyes = beautyParametrs["morph_eyes_str"] ?? .zero
            let currentNose = beautyParametrs["morph_nose_str"] ?? .zero
            
            let cheeksSlider = SliderConfig(title: "Cheeks", type: "morph_cheeks_str", currentValue: currentCheeks, maxValue: 2, shouldValueRounded: false, identifier: "beautification.morph.cheeks")
            let eyesSlider = SliderConfig(title: "Eyes", type: "morph_eyes_str", currentValue: currentEyes, maxValue: 2, shouldValueRounded: false, identifier: "beautification.morph.eyes")
            let noseSlider = SliderConfig(title: "Nose", type: "morph_nose_str", currentValue: currentNose, maxValue: 2, shouldValueRounded: false, identifier: "beautification.morph.nose")
            
            configs.append(cheeksSlider)
            configs.append(eyesSlider)
            configs.append(noseSlider)
        case .skin:
            let currentSoft = beautyParametrs["skin_soft_str"] ?? .zero
            let currentAlpha = beautyParametrs["softlight_alpha"] ?? .zero
            let currentTex = beautyParametrs["softlight_tex"] ?? .zero
            
            let softSlider = SliderConfig(title: "Softness", type: "skin_soft_str", currentValue: currentSoft, maxValue: 2, shouldValueRounded: false, identifier: "beautification.skin.soft")
            let alphaSlider = SliderConfig(title: "Alpha", type: "softlight_alpha", currentValue: currentAlpha, maxValue: 1, shouldValueRounded: false, identifier: "beautification.skin.alpha")
            let texSlider = SliderConfig(title: "Tex", type: "softlight_tex", currentValue: currentTex, maxValue: 10, shouldValueRounded: true, identifier: "beautification.skin.tex")
            
            configs.append(softSlider)
            configs.append(alphaSlider)
            configs.append(texSlider)
        case .teeth:
            let currentWhitening = beautyParametrs["teeth_whitening_str"] ?? .zero
            let whiteningSlider = SliderConfig(title: "Whitening", type: "teeth_whitening_str", currentValue: currentWhitening, maxValue: 2, shouldValueRounded: false, identifier: "beautification.teeth.Whitening")
            configs.append(whiteningSlider)
        }
        
        let slidersHeight = CGFloat(configs.count) * Defaults.sliderCellHeight
        self.beautificationTableViewHeight.constant = slidersHeight
        self.beautificationTableViewHandler?.applyConfig(configs)
    }
}

// MARK:- UIColor extension
extension UIColor {
    var redValue: CGFloat{ return CIColor(color: self).red }
    var greenValue: CGFloat{ return CIColor(color: self).green }
    var blueValue: CGFloat{ return CIColor(color: self).blue }
    var alphaValue: CGFloat{ return CIColor(color: self).alpha }
    
    func getColorStringRepresentation(withAlpha currentAlpha: Float) -> String {
        let red = String(Float(redValue))
        let green = String(Float(greenValue))
        let blue = String(Float(blueValue))
        let alpha = String(currentAlpha)
        return "[\(red),\(green),\(blue),\(alpha)]"
    }
}
