import UIKit

class EffectCollectionViewCell: UICollectionViewCell {
    
    @IBOutlet weak var makeupName: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        makeupName.alpha = 0.6
    }
    
    override var isSelected: Bool {
        didSet {
            makeupName.alpha = isSelected ? 1.0 : 0.6
        }
    }
}
