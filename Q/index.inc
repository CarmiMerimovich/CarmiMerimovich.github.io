{% assign hebrew = false %}
{% if page.url contains "_he.html" %}
	{% assign hebrew = true %}
{% endif %}

{% assign suffix = "_en.html" %}
{% if hebrew %}
{% assign suffix = "_he.html" %}
{% endif %}
<ol>
{% assign topic = "" %}
{% assign s = site.pages | sort: "topic" %}
{% assign qn = 0 %}
{% for  question in s %}
	{% unless question.name contains suffix %}
		{% continue %}
	{% endunless %}
	{% unless question.shortText %}
		{% continue %}
	{% endunless %}
	{% assign qn = qn | plus: 1 %}
	{% if question.topic != topic %}
		</ol>
		<h3>{{question.topic}}</h3>
		{% assign topic = question.topic %}
		<ol start="{{qn}}">
	{% endif %}
	<li>
	<a href="{{site.baseurl}}{{question.url}}">{{question.shortText}}</a>
	</li>
{% endfor %}
</ol>
