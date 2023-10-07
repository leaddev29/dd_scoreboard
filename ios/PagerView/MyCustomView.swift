//
//  MyCustomView.swift
//  Scoreboard
//
//  Created by Saqib on 10/3/22.
//

//https://www.appsloveworld.com/swift/100/234/adding-a-uipageviewcontroller-into-an-already-existing-view-controller-with-a-fra
//GOOGLE_SEARCH ->Swift integrate UIPageViewController to a view

import UIKit

class MyCustomView: UIView{
  
  var pageViewController: CustomPageViewController!;
  @objc var data : [Int] = []
  @objc var currentViewControllerIndex = 0;
  @objc var teamName = "-";
  @objc var teamNameVisibility = true;
  
  var activeController : PageController? = nil
  @objc var color : String = "#808080" {
    didSet {
      print("color did set called with string \(color)")
      guard let pageController = self.activeController
//      , let _color = UIColor(hexString: color)
      else { return }
      UIColor(hexString: color)
      pageController.view.layer.backgroundColor = UIColor(hexString: color).cgColor
    }
  }
  
  @objc var status = false {
      didSet {
          self.setupView()
      }
  }
   
  @objc var onClick: RCTBubblingEventBlock?
  @objc var onPageScroll: RCTBubblingEventBlock?
  
   
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
      
    guard let onClick = self.onClick else { return }
      let params: [String : Any] = ["value1":"react demo","value2":1]
      onClick(params)
//    self.goToPage(self.currentViewControllerIndex+1)
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    print("Init Called");
  }
  
  override func layoutSubviews() {
    print("Layout Subviews Called.")
    print("SubView Count = \(self.subviews.count)")
    print("Self.Data.count = \(self.data.count)")
    print("Self.TeamName = \(self.teamName)")
    print("Self.teamNameVisbility = \(self.teamNameVisibility)")
    self.isUserInteractionEnabled = true
    configurePageViewController()
    
  }//
  
 
  required init?(coder aDecoder: NSCoder) {
    
    super.init(coder: aDecoder)
    self.isUserInteractionEnabled = true
  }

  
  private func setupView() {
    
    self.backgroundColor = self.status ? .green : .red
  }
  
  @objc func goToPage(_ index : Int){
    print("Go To Page Called \(index).")
    if(index >= self.data.count || index < 0 ){
      return
    } 
    var direction: UIPageViewController.NavigationDirection = .forward
    if currentViewControllerIndex > index {
        direction = .reverse
    }
    print("Called - To move to \(index) view Controller")
    var goToPageController : PageController!
    goToPageController = self.dataViewControllerAt(index: index, frame: self.frame) as? PageController
    self.currentViewControllerIndex = index;
    pageViewController.setViewControllers(
      [goToPageController],
      direction: direction,
      animated: true,
      completion: nil
    )
  }
  
  @objc func updateTeamNameVisibility(_ visibilityFlag : Bool){
    print("updateTeamNameVisibility Called \(index). value \(visibilityFlag)")
    
    self.teamNameVisibility = visibilityFlag;
    self.activeController?.setTeamNameLabelVisibility(visibilityFlag);
  }
  
  @objc func updateTeamName(_ pTeamName : String){
    print("updateTeamNameVisibility Called \(index).")
    
    self.teamName = pTeamName;
  }
  
  @objc func updateBg(_ pBGColor : String){
    print("updateTeamNameVisibility Called \(index).")
    
    self.color = pBGColor;
  }
  
 }

extension MyCustomView :  UIGestureRecognizerDelegate {
  
  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
    print("MAIN VIEW - Should receive Called.")
    if let _gesture = gestureRecognizer as? UISwipeGestureRecognizer {
      if(_gesture.direction == .right || _gesture.direction == .left){
        print("MAIN VIEW - Gestures Horizontal")
        return false
      }
    }
    return true
  }
  
}


extension UIView {
  
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder!.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }
  
    func findViewController() -> UIViewController? {
        if let nextResponder = self.next as? UIViewController {
            return nextResponder
        } else if let nextResponder = self.next as? UIView {
            return nextResponder.findViewController()
        } else {
            return nil
        }
    }

}

extension UIColor {
   convenience init(hexString: String, alpha: CGFloat = 1.0) {
          let hexString: String = hexString.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
          let scanner = Scanner(string: hexString)
          if (hexString.hasPrefix("#")) {
              scanner.scanLocation = 1
          }
          var color: UInt32 = 0
          scanner.scanHexInt32(&color)
          let mask = 0x000000FF
          let r = Int(color >> 16) & mask
          let g = Int(color >> 8) & mask
          let b = Int(color) & mask
          let red   = CGFloat(r) / 255.0
          let green = CGFloat(g) / 255.0
          let blue  = CGFloat(b) / 255.0
          self.init(red:red, green:green, blue:blue, alpha:alpha)
    }
    public convenience init?(hex: String) {
        let r, g, b, a: CGFloat

        if hex.hasPrefix("#") {
            let start = hex.index(hex.startIndex, offsetBy: 1)
            let hexColor = String(hex[start...])

            if hexColor.count == 8 {
                let scanner = Scanner(string: hexColor)
                var hexNumber: UInt64 = 0

                if scanner.scanHexInt64(&hexNumber) {
                    r = CGFloat((hexNumber & 0xff000000) >> 24) / 255
                    g = CGFloat((hexNumber & 0x00ff0000) >> 16) / 255
                    b = CGFloat((hexNumber & 0x0000ff00) >> 8) / 255
                    a = CGFloat(hexNumber & 0x000000ff) / 255

                    self.init(red: r, green: g, blue: b, alpha: a)
                    return
                }
            }
        }

        return nil
    }
}
