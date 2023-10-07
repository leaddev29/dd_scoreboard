//
//  CustomPageViewController.swift
//  Scoreboard
//
//  Created by Saqib on 10/18/22.
//

import Foundation
import UIKit

class CustomPageViewController : UIPageViewController, UIGestureRecognizerDelegate{
    
  override func viewDidLoad() {
    super.viewDidLoad()
    
    for gr in self.gestureRecognizers {
      gr.delegate = self
    }
  }
  
  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
    print("Should receive Called.")
    print("Gesture Name \(gestureRecognizer)")
    if let _ = gestureRecognizer as? UITapGestureRecognizer {
      let touchPoint = touch.location(in: self.view)
        if (touchPoint.y > 40 ){
            return false
        }else{
            return true
        }
    }
    if let _gesture = gestureRecognizer as? UISwipeGestureRecognizer {
      print("is swipe gesture with direction = \(_gesture.direction)")
      
      if(_gesture.direction == .right || _gesture.direction == .left){
        print("Gestures Horizontal")
        return false
      }
    }
    return true
}//
  
  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive press: UIPress) -> Bool {
    print("Press Called")
    if let _gesture = gestureRecognizer as? UISwipeGestureRecognizer {
      print("is swipe gesture with direction = \(_gesture.direction)")
      
      if(_gesture.direction == .right || _gesture.direction == .left){
        print("Gestures Horizontal")
        return false
      }
    }
    return true
  }
  
  func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
    print("Gesture Recognizer Should begin called.")
    if let _gesture = gestureRecognizer as? UISwipeGestureRecognizer{
      print("IS Swipe Gesture and direction \(_gesture.direction)")
      if(_gesture.direction == .left || _gesture.direction == .right){
        print("IS Horizontal Gesture.")
        return false
      }
    }
    return true
  }
  
            
}
