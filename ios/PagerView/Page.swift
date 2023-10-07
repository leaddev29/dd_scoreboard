//
//  Page.swift
//  Scoreboard
//
//  Created by Saqib on 10/3/22.
//

import Foundation
import UIKit


class Page : UIViewController{
  var  displayText: String?
  var  index: Int?
  @IBOutlet var contentView : UIView!
  @IBOutlet var mainLabel : UILabel!
  
  
  override func viewDidLoad() {
    mainLabel.text = "Label at Index = \(index)"
    self.contentView.isHidden = false
    self.mainLabel.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(labeTapped)))
    self.contentView.layer.backgroundColor = UIColor.systemPink.cgColor
    self.contentView.isUserInteractionEnabled = true
  }
  
  @objc func labeTapped(){
    print("Label Tapped.")
  }
  @IBAction func tap(){
    print("Button Tapped")
  }
  
//  override init(frame: CGRect) {
//    super.init(frame: frame)
//
//  }
 
//  required init?(coder aDecoder: NSCoder) {
//    super.init(coder: aDecoder)
//
//  }
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
//        guard let onClick = self.onClick else { return }
  
//        let params: [String : Any] = ["value1":"react demo","value2":1]
//        onClick(params)
      print("onClick page of index = \(index)")
    }
  
}
