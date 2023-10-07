//
//  Extension.swift
//  Scoreboard
//
//  Created by Saqib Rehman on 10/3/22.
//
//https://stackoverflow.com/questions/27121655/create-a-copy-of-a-uiview-in-swift

import Foundation
import UIKit

extension MyCustomView {
  
  func configurePageViewController(){
    
    print(" CustomView is UserInteraction Enabled = \(isUserInteractionEnabled)")
    print("called configure page view controller");
//    pageViewController = UIPageViewController(transitionStyle: .pageCurl, navigationOrientation: .vertical, options: nil)
    pageViewController = CustomPageViewController(transitionStyle: .pageCurl, navigationOrientation: .vertical, options: nil)
    guard let parent = self.findViewController() as? UIViewController else {
      print("Parent is nil!.")
      return
    }
    
    print("Top Most Controler not nil.")
    parent.addChild(pageViewController);
    addSubview(pageViewController.view)
    pageViewController.didMove(toParent: parent);
    
    pageViewController.delegate  = self
    pageViewController.dataSource = self
  
    pageViewController.view.translatesAutoresizingMaskIntoConstraints = false
    
    let views : [String:Any] = ["pageView":pageViewController.view]
    
    addConstraints(NSLayoutConstraint.constraints(
          withVisualFormat: "H:|-0-[pageView]-0-|",
          options: NSLayoutConstraint.FormatOptions(rawValue: 0),
          metrics: nil,
         views: views))
    addConstraints(NSLayoutConstraint.constraints(
          withVisualFormat: "V:|-0-[pageView]-0-|",
          options: NSLayoutConstraint.FormatOptions(rawValue: 0),
          metrics: nil,
         views: views))
    
    pageViewController.view.isUserInteractionEnabled = true
      
    guard let startingViewController = dataViewControllerAt(index: currentViewControllerIndex, frame: self.bounds)
    else {
      print("Starting View Controller is empty.")
      return
    }
    pageViewController.setViewControllers([startingViewController], direction: .forward, animated: true)
    pageViewController.view.backgroundColor = UIColor.blue
    print("Transition Style of PageViewController = \(pageViewController.transitionStyle)")
    bringSubviewToFront(pageViewController.view)
    pageViewController.view.isUserInteractionEnabled = true;
  }
  
  @objc func buttonTapped(){
    print("Button Tapped.")
  }
  
  func dataViewControllerAt( index: Int , frame: CGRect) -> UIViewController?{
    if index >= data.count || data.count == 0 {
        return nil
    }
    let controllerIndex = index%4
    return dataViewControllerAt(index: index, frame: frame, atControllerIndex: controllerIndex)
  }
  
  func dataViewControllerAt( index: Int , frame: CGRect, atControllerIndex: Int) -> UIViewController?{
    
    if index >= data.count || data.count == 0 {
        return nil
    }
    let controllerIndex = atControllerIndex;
    let controller = PageController()
    
    controller.teamNameVisibility = self.teamNameVisibility;
    controller.view.frame = frame
    print("self.color = \(self.color)")
    
//    if let _color = UIColor(hex: self.color) {
//      controller.view.layer.backgroundColor = _color.cgColor
//    }else{
//      print("self.color - UIColor is nil")
//    }
    controller.view.layer.backgroundColor = UIColor(hexString: color).cgColor
    self.activeController = controller
    controller.index = index
    controller.setLabel(String(self.data[index]))
//        controller.setLabel(String(999))
    controller.setTeamNameLabel(self.teamName)
    
    controller.setTeamNameLabelVisibility(self.teamNameVisibility)
    print("Mod = \(controllerIndex)")
    return controller
    
  }//
}


class PageController : UIViewController{
  var index : Int?
  var label : UILabel?
  var teamNameVisibility = false;
//  var teamNameLabel : UILabel?
  
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.label = UILabel()
//    self.teamNameLabel = UILabel()
    self.view.addSubview(self.label!)
//    self.view.addSubview(self.teamNameLabel!)
    
//    self.view.translatesAutoresizingMaskIntoConstraints = false
    
    var topPadding = 0;
    if(teamNameVisibility) {
      topPadding = 45
    } else {
      topPadding = 15
    }
    self.label!.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([

      self.label!.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
      self.label!.centerYAnchor.constraint(equalTo: self.view.centerYAnchor,constant: CGFloat(topPadding))

    ])
    
//    self.teamNameLabel!.translatesAutoresizingMaskIntoConstraints = false
//    let bottomConstraint = NSLayoutConstraint(item: self.teamNameLabel,
//                                               attribute: .bottom,
//                                               relatedBy: .equal,
//                                               toItem: self.view,
//                                               attribute: .bottom,
//                                               multiplier: 1.0,
//                                               constant: 0.0)
//
//    let centerYConstraint = NSLayoutConstraint(item: self.teamNameLabel,
//                                               attribute: .centerX,
//                                               relatedBy: .equal,
//                                               toItem: self.view,
//                                               attribute: .centerX,
//                                               multiplier: 1.0,
//                                               constant: 0.0)

//    NSLayoutConstraint.activate([bottomConstraint, centerYConstraint])
    
        
//        NSLayoutConstraint.activate([
//
//          self.teamNameLabel!.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
//          self.teamNameLabel!.centerYAnchor.constraint(equalTo: self.view.bottomAnchor,constant: 10)
//
//        ])
    
//    NSLayoutConstraint.activate([
//
//      self.teamNameLabel!.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
//      self.teamNameLabel!.y.constraint(equalTo: self.view.bottomAnchor,constant: 10)
//
//
//    ])
    self.label?.textColor = UIColor.white
    self.label?.font = UIFont(name: "Tungsten-Medium",size: 370)
//    self.view.layer.backgroundColor = UIColor.gray.cgColor
    self.label?.adjustsFontSizeToFitWidth = true
    self.label?.minimumScaleFactor = 0.5
    
    
    
//    self.teamNameLabel?.textColor = UIColor.white
//    self.teamNameLabel?.font = UIFont(name: "Tungsten-Medium",size: 60)
//    self.teamNameLabel?.adjustsFontSizeToFitWidth = true
//    self.teamNameLabel?.minimumScaleFactor = 0.5
    
    
    let strokeTextAttributes: [NSAttributedString.Key : Any] = [
        .strokeColor : UIColor.black,
        .foregroundColor : UIColor.white,
        .strokeWidth : -0.5,
        ]

    self.label?.attributedText = NSAttributedString(string: "Foo", attributes: strokeTextAttributes)
//    self.teamNameLabel?.attributedText = NSAttributedString(string: "Foo", attributes: strokeTextAttributes)
    
//    self.label?.adjustsFontSizeToFitWidth = true
//    self.label?.minimumScaleFactor = 1.5

    
    
    self.view.layer.backgroundColor = UIColor.gray.cgColor
    
    
  }
  
  public func setLabel(_ text: String){
    guard let _label = self.label else {
      return
    }
    _label.text = text
  }
  public func setTeamNameLabel(_ text: String){
//    guard let _label = self.teamNameLabel else {
//      return
//    }
//    _label.text = text
  }
  
  public func setTeamNameLabelVisibility(_ showFlag: Bool){
    
    print("setTeamNameLabelVisibility Called value \(showFlag)")
    teamNameVisibility = showFlag
    
    
//    var topPadding = 0;
//    if(teamNameVisibility) {
//      topPadding = 50
//    } else {
//      topPadding = 10
//    }
//    self.label!.translatesAutoresizingMaskIntoConstraints = false
//    NSLayoutConstraint.activate([
//
//      self.label!.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
//      self.label!.centerYAnchor.constraint(equalTo: self.view.centerYAnchor,constant: CGFloat(topPadding))
//
//    ])

    
    
    
//    guard let _label = self.teamNameLabel else {
//      return
//    }
//    _label.isHidden = !showFlag
  }
  
}


extension MyCustomView : UIPageViewControllerDelegate , UIPageViewControllerDataSource{
  
  public func presentationIndex(for pageViewController: UIPageViewController) -> Int {
    print("currentIndex = \(currentViewControllerIndex)")
    return currentViewControllerIndex
  }

  func presentationCount(for pageViewController: UIPageViewController) -> Int {
    print("presentationCount = \(data.count)")
      return data.count
  }

  func pageViewController(_ pageViewController: UIPageViewController, viewControllerBefore viewController: UIViewController) -> UIViewController? {

      print("--Before--")
      print("Data Source Length = \(data.count)")
      let dataViewController = viewController as? PageController
      guard var index = dataViewController?.index else { return nil }
      print("current-index = \(index)")
      print("currentViewControllerIndex = \(currentViewControllerIndex)")
      if index == 0 {
          print("returned nil")
          return nil
      }
      //FREE CONTROLLER VIEWS
//      freeNeighbours(neighboursOfIndex: index)
      print("Previous Index number \(index)")
      index -= 1
      currentViewControllerIndex = index
      print("Current Index number \(index)")
      print("Before Controller Called for index = \(index)")
    return dataViewControllerAt(index: index, frame: self.bounds)

  }

  func pageViewController(_ pageViewController: UIPageViewController, viewControllerAfter viewController: UIViewController) -> UIViewController? {

    print("--AFTER--")
    let dataViewController = viewController as? PageController
    guard var index = dataViewController?.index else { return nil }
    if index == data.count{
        return nil
    }
    //FREE CONTROLLER VIEWS
//    freeNeighbours(neighboursOfIndex: index)
    index += 1
    currentViewControllerIndex = index
    return dataViewControllerAt(index: index,frame: self.bounds)

  }
  
  func pageViewController(_ pageViewController: UIPageViewController, didFinishAnimating finished: Bool, previousViewControllers: [UIViewController], transitionCompleted completed: Bool) {
    if(completed){
      guard let onPageScroll = self.onPageScroll else { return }
      let params: [String : Any] = ["page":self.currentViewControllerIndex]
      onPageScroll(params)
    }
  }

}

