import UIKit
import BNBSdkApi
import BNBSdkCore

private struct Defaults {
    
    static let makeupArray = [
        ["Highlighting", "Makeup.highlighter", "Makeup.clear"],
        ["Contouring", "Makeup.contour", "Makeup.clear"],
        ["Foundation", "Skin.color", "Makeup.clear"],
        ["Skin softening","Skin.softening","Makeup.clear"],
        ["Blush", "Makeup.blushes", "Makeup.clear"],
        ["Softlight", "Softlight.strength", "Makeup.clear"],
        ["EyeLiner", "Makeup.eyeliner", "Makeup.clear"],
        ["Eyeshadow", "Makeup.eyeshadow", "Makeup.clear"],
        ["Eyelashes", "Makeup.lashes", "Makeup.clear"],
        ["Matt lipstick", "Lips.matt", "Lips.clear"],
        ["Shiny lipstick", "Lips.shiny", "Lips.clear"],
        ["Glitter lipstick", "Lips.glitter", "Lips.clear"],
    ]
    
    static let facebeautyArray = [
        ["Teeth whitening", "Teeth.whitening", "TeethWhitening.strength"],
        ["Eyes morphing", "FaceMorph.eyes", "FaceMorph.clear"],
        ["Face morphing", "FaceMorph.face", "FaceMorph.clear"],
        ["Nose morphing", "FaceMorph.nose", "FaceMorph.clear"],
        ["Skin softening", "Skin.softening", "Skin.softening"],
        ["Skin coloring", "Skin.color", "Skin.clear"],
        ["Hair coloring", "Hair.color", "Hair.clear"],
        ["Eyes coloring", "Eyes.color", "Eyes.clear"],
        ["Eye flare", "Eyes.flare", "Eyes.flare"],
        ["Eyes whitening", "Eyes.whitening", "Eyes.whitening"]
    ]
    
    static let colorArray = [
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

class CameraViewController: UIViewController {
    
    @IBOutlet weak var makeupCollection: UICollectionView!
    @IBOutlet weak var effectView: EffectPlayerView!
    @IBOutlet weak var alphaLabel: UILabel!
    @IBOutlet weak var colorLabel: UILabel!
    @IBOutlet weak var intensityLabel: UILabel!
    @IBOutlet weak var alphaSlider: UISlider!
    @IBOutlet weak var colorSlider: UISlider!
    @IBOutlet weak var intensitySlider: UISlider!
    @IBOutlet weak var importImageButton: UIButton!
    @IBOutlet weak var segmentControl: UISegmentedControl!
    
    private let imagePicker = UIImagePickerController()
    private let cameraDevice = CameraDevice(cameraMode: .FrontCameraSession, captureSessionPreset: .hd1280x720)
    private var player: Player? = nil
    private var effectsArray = [[String]]()
    private var currentEffect: BNBEffect? = nil
    private var selectedIndexPath = IndexPath(item: 0, section: 0)
    private var currentEffectName: String = Defaults.makeupArray[0][0]
    private var currentColorMethod: String = Defaults.makeupArray[0][1]
    private var currentClearMethod: String = Defaults.makeupArray[0][2]
    private var currentIntensity: Float = .zero
    private var currentAlpha: Float = .zero
    private var currentColor: UIColor = .black {
        didSet {
            colorSlider.tintColor = currentColor
        }
    }
    
    private var imagePath = FileManager.default.urls(
        for: .documentDirectory,
        in: .userDomainMask
    )
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setupUI()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        cameraDevice.start()
        setupPlayer()
    }
    
    private func setupPlayer() {
        player = Player()
        player?.use(input: Camera(cameraDevice: cameraDevice), outputs: [effectView])
        currentEffect = player?.load(effect: "Makeup")
    }
    
    private func hideControls(hideColors: Bool, hideIntensity: Bool) {
        colorLabel.isHidden = hideColors
        colorSlider.isHidden = hideColors
        alphaLabel.isHidden = hideColors
        alphaSlider.isHidden = hideColors
        intensityLabel.isHidden = hideIntensity
        intensitySlider.isHidden = hideIntensity
    }
    
    private func setupUI() {
        importImageButton.isEnabled = true
        effectsArray = Defaults.makeupArray
        imagePicker.delegate = self
        imagePicker.allowsEditing = false
        imagePicker.sourceType = .photoLibrary
        effectView.layer.cornerRadius = 20
        effectView.layer.masksToBounds = true
        makeupCollection.selectItem(
            at: selectedIndexPath,
            animated: false,
            scrollPosition: .centeredVertically
        )
        hideControls(hideColors: false, hideIntensity: true)
        currentColor = Defaults.colorArray[Int(colorSlider.value)]
        currentAlpha = alphaSlider.value
        if #available(iOS 13.0, *) {
            segmentControl.setTitleTextAttributes([.foregroundColor: UIColor.black], for: .selected)
            segmentControl.selectedSegmentTintColor = .white
        } else {
            segmentControl.tintColor = .white
        }
    }
    
    private func getDocumentsDirectoryImage() -> URL {
        return imagePath[0]
    }
}

// MARK:- Actions
extension CameraViewController {
    @IBAction func colorChangeAction(_ sender: UISlider) {
        let currentColor = Defaults.colorArray[Int(sender.value)]
        self.currentColor = currentColor
        currentEffect?.callJsMethod(
            currentColorMethod,
            params: currentColor.getColorStringRepresentation(withAlpha: currentAlpha)
        )
    }
    
    @IBAction func alphaChangeAction(_ sender: UISlider) {
        currentAlpha = sender.value
        self.currentEffect?.callJsMethod(
            currentColorMethod,
            params: currentColor.getColorStringRepresentation(withAlpha: currentAlpha)
        )
    }
    
    @IBAction func intensityChangeAction(_ sender: UISlider) {
        currentIntensity = sender.value
        currentEffect?.callJsMethod(currentColorMethod, params: "\(currentIntensity)")
    }
    
    @IBAction func clearMakeupColor(_ sender: UIButton) {
        currentEffect?.callJsMethod(currentClearMethod, params: "")
    }
    
    @IBAction func importImage(_ sender: UIButton) {
        let alertController = UIAlertController(
            title: "\(currentEffectName)",
            message: "Select custom \(currentEffectName) texture in your Gallery",
            preferredStyle: .alert
        )
        let openGallery = UIAlertAction(title: "Open Gallery", style: .default) { UIAlertAction in
            self.present(self.imagePicker, animated: true, completion: nil)
        }
        alertController.addAction(openGallery)
        self.present(alertController, animated: true, completion: nil)
    }
    
    @IBAction func rotateCamera(_ sender: UIButton) {
        cameraDevice.switchMode()
        print("RotateCamera")
    }
    
    @IBAction func resetPlayer(_ sender: UIButton) {
        player = nil
        setupPlayer()
        print("ResetPlayer")
    }
    
    @IBAction func makePhoto(_ sender: UIButton) {
        let imageOutput = Frame<UIImage>() { image in
            if let image = image {
                DispatchQueue.main.async {
                    let alert = UIAlertController(title: "Image was successfully saved", message: nil, preferredStyle: .alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(alert, animated: true) {
                        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
                    }
                    self.player?.use(outputs: [self.effectView])
                }
            }
        }

        player?.use(outputs: [effectView, imageOutput])
    }
    
    @IBAction func changeCategory(_ sender: UISegmentedControl) {
        switch segmentControl.selectedSegmentIndex {
        case 0:
            effectsArray = Defaults.makeupArray
            makeupCollection.reloadData()
        default:
            effectsArray = Defaults.facebeautyArray
            makeupCollection.reloadData()
        }
    }
}

// MARK:- UICollectionView extension
extension CameraViewController: UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return effectsArray.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = makeupCollection.dequeueReusableCell(withReuseIdentifier: "myCell", for: indexPath) as? EffectCollectionViewCell else { return EffectCollectionViewCell() }
        cell.makeupName.text = effectsArray[indexPath.row][0]
        cell.backgroundColor = .white
        cell.layer.cornerRadius = 8
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: 50, height: 35)
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        self.makeupCollection.scrollToItem(
            at: indexPath,
            at: .centeredHorizontally,
            animated: true
        )
        currentEffectName = effectsArray[indexPath.row][0]
        currentColorMethod = effectsArray[indexPath.row][1]
        currentClearMethod = effectsArray[indexPath.row][2]
        currentEffect?.callJsMethod(
            currentColorMethod,
            params: currentColor.getColorStringRepresentation(withAlpha: currentAlpha)
        )
        switch effectsArray[indexPath.row][0] {
        case "Teeth whitening", "Eyes morphing", "Face morphing", "Nose morphing", "Softlight", "Eye flare", "Eyes whitening", "Skin smoothing", "Skin softening":
            currentEffect?.callJsMethod(currentColorMethod, params: "\(currentIntensity)")
            importImageButton.isEnabled = false
            hideControls(hideColors: true, hideIntensity: false)
        case "Eyeshadow", "Eyeliner", "Eyelashes", "Contouring", "Highlighting", "Blush":
            importImageButton.isEnabled = true
            hideControls(hideColors: false, hideIntensity: true)
        default:
            importImageButton.isEnabled = false
            hideControls(hideColors: false, hideIntensity: true)
        }
    }
}


extension CameraViewController: UINavigationControllerDelegate, UIImagePickerControllerDelegate {
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        let outputUrl = getDocumentsDirectoryImage().appendingPathComponent("makeup.png")
        try? FileManager.default.removeItem(at: getDocumentsDirectoryImage().appendingPathComponent("makeup.png"))
        if let pickedImage = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
            let imageData = pickedImage.pngData()
            try? imageData?.write(to: outputUrl)
            currentEffect?.callJsMethod(
                currentColorMethod,
                params: currentColor.getColorStringRepresentation(withAlpha: currentAlpha)
            )
            currentEffect?.callJsMethod(currentColorMethod, params: outputUrl.path)
            
        }
        dismiss(animated: true, completion: nil)
    }
}

// MARK:- UIColor extension
extension UIColor {
    var redValue: CGFloat { return CIColor(color: self).red }
    var greenValue: CGFloat { return CIColor(color: self).green }
    var blueValue: CGFloat { return CIColor(color: self).blue }
    var alphaValue: CGFloat { return CIColor(color: self).alpha }
    
    func getColorStringRepresentation(withAlpha currentAlpha: Float) -> String {
        let red = String(Float(greenValue))
        let green = String(Float(greenValue))
        let blue = String(Float(blueValue))
        let alpha = String(currentAlpha)
        return "\(red) \(green) \(blue) \(alpha)"
    }
}
