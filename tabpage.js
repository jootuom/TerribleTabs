function generateCategory(node) {
	var container = document.getElementById("Bookmarks");
	
	var div = document.createElement("div");
	var title = document.createElement("h1");

	div.className = "category";
	title.innerHTML = node.title;

	div.appendChild(title);
	container.appendChild(div);

	var ul = document.createElement("ul");
	div.appendChild(ul);
	
	generateTree(ul, node);
}

function showOnClick() {
	var links = this.parentNode.childNodes;

	// The first element is always the link itself, skip it
	for (i = 1; i < links.length; i++) {
		var s = links[i].style;
		
		s.display == "none" || s.display == "" ?
			s.display = "block" : s.display = "none";
	}
}

function generateTree(parent, node) {
	node.children.forEach(
		function(child) {
			// Folder
			if (child.children) {
				var ul = document.createElement("ul");
				ul.className = "bmfolder";
				
				var a = document.createElement("a");
				a.className = "bmfolderlink";
				a.innerHTML = child.title + "/";
				
				a.addEventListener("click", showOnClick);
				
				ul.appendChild(a);
				parent.appendChild(ul);
				
				generateTree(ul, child);
			
			// Bookmark
			} else {
				var li = document.createElement("li");
				
				var a = document.createElement("a");
				a.setAttribute("href", child.url);
				a.innerHTML = child.title;
				
				li.appendChild(a);
				parent.appendChild(li);
			}
		}
	);
}

// "2" is "Other Bookmarks"
chrome.bookmarks.getSubTree("2", function (node) {
	var ourfolder = node[0].children.filter(function (node) {
		return node.title == "TerribleTabs";
	})[0];
	
	if (!ourfolder) {
		chrome.bookmarks.create({"parentId": "2", "title": "TerribleTabs"});
		window.location.reload(true);
	}
	
	ourfolder.children.forEach(function (node) {
		generateCategory(node);
	});
});
