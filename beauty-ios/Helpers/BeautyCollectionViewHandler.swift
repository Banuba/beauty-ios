import Foundation
import UIKit

private struct Defaults {
    static var cellWidth: CGFloat = 110
    static var beautyTypes: [BeautyTypes] { BeautyTypes.allCases }
}

enum BeautyTypes: String, CaseIterable {
    case color
    case brows
    case eyes
    case lashes
    case morph
    case skin
    case teeth
}

class BeautyCollectionCell: UICollectionViewCell {
    @IBOutlet weak var titleLabel: UILabel!
    private(set) var beautyType: BeautyTypes?
    
    func setup(beautyType: BeautyTypes) {
        titleLabel.text = beautyType.rawValue
        self.beautyType = beautyType
    }
}

class BeautyCollectionViewHandler: NSObject {
    private var collectionView: UICollectionView
    var didSelectItem: ((BeautyTypes) -> Void)?
    
    init(collectionView: UICollectionView) {
        self.collectionView = collectionView
        super.init()
        
        collectionView.delegate = self
        collectionView.dataSource = self
    }
}

extension BeautyCollectionViewHandler: UICollectionViewDelegate, UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let type = Defaults.beautyTypes[indexPath.row]
        didSelectItem?(type)
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        Defaults.beautyTypes.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "BeautyCollectionCell", for: indexPath) as! BeautyCollectionCell
        let type = Defaults.beautyTypes[indexPath.row]
        
        cell.setup(beautyType: type)
        return cell
    }
}
