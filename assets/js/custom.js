function active_tab(pills_id, contents_id, target_id, trigger) {
  var target = document.getElementById(target_id);

  var pills = document.getElementById(pills_id);
  var pills_li = pills.getElementsByTagName("LI");

  var contents = document.getElementById(contents_id);
  var content_tabs = contents.getElementsByClassName("tab_content");

  for (var i = 0; i < pills_li.length; i++) {
    pills_li[i].classList.remove("active");
  }

  for (var i = 0; i < content_tabs.length; i++) {
    content_tabs[i].classList.remove("active");
  }

  target.classList.add("active");
  trigger.classList.add("active");
}

var target_nav = document.getElementById("nav_menu");
var target_nav_toggle = document.getElementById("nav_toggle");

function toggle_nav() {
  target_nav.classList.toggle("active");
  target_nav_toggle.classList.toggle("active");
}
