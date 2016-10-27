//
//  NotificationsHelper.swift
//  magnet
//
//  Created by Francisco Jordano on 12/07/2016.
//

import Foundation
import UIKit

@objc(NotificationsHelper) class NotificationsHelper: NSObject {
  static var enabled: Bool = true
  static var notifyTimer: NSTimer!
  static var toNotify: [String] = []
  
  @objc class func register() {
    let notificationsSettings = UIUserNotificationSettings(forTypes: [.Alert, .Badge], categories: nil)
    UIApplication.sharedApplication().registerUserNotificationSettings(notificationsSettings)
  }
  
  class func updateNotifications() {
    guard enabled else { return }
    
    UIApplication.sharedApplication().cancelAllLocalNotifications()
    // Clean any badge
    UIApplication.sharedApplication().applicationIconBadgeNumber = 0
    let notification = UILocalNotification()
    notification.alertBody = "Content found nearby"
    UIApplication.sharedApplication().presentLocalNotificationNow(notification)
  }
  
  class func showNotification(msg: String) {
    UIApplication.sharedApplication().cancelAllLocalNotifications()
    // Clean any badge
    UIApplication.sharedApplication().applicationIconBadgeNumber = 0
    let notification = UILocalNotification()
    notification.alertBody = msg
    UIApplication.sharedApplication().presentLocalNotificationNow(notification)
  }
  
  // Throttles the notification process, waiting for 10 seconds until
  // setting up the badge with the number of elements nearby.
  class func notifyUser(url: String) {
    guard History.getInstance().getRecent(url) == nil else { return }
    guard toNotify.contains(url) == false else { return }
    
    toNotify.append(url)
    if (notifyTimer != nil) {
      notifyTimer.invalidate();
    }
    
    // We need to throttle the notifications, waiting for receive more nearby web pages,
    // so we use NSTimer to wait for 10 seconds and after that we trigger the action, in
    // this case doNotifyUser, that notifies depending on the number of web pages found
    // during the waiting period.
    notifyTimer = NSTimer.init(
      timeInterval: 10 ,
      target: self,
      selector: #selector(doNotifyUser),
      userInfo: nil,
      repeats: false)
    // It's important to note that this timer is being execute in the main loop
    // (look at NSRunLoop.mainRunLoop) to be sure that the notifications will reflect
    // changes in the UI despite of this being trigget in the background.
    NSRunLoop.mainRunLoop().addTimer(notifyTimer, forMode: NSDefaultRunLoopMode)
    
    // Save the record in history for analyzing in future iterations.
    History.getInstance().record(url)
  }
  
  @objc private class func doNotifyUser() {
    NotificationsHelper.updateNotifications();
    toNotify = [];
  }
  
  @objc class func clearNotifications() {
    UIApplication.sharedApplication().cancelAllLocalNotifications()
    self.updateNotifications()
  }
  
  @objc class func enable() {
    enabled = true
  }
  
  @objc class func disable() {
    enabled = false
  }
}
