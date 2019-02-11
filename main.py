import json
import re

import requests
from bs4 import BeautifulSoup

# De Anza's course listing root URL. Add query parameters to get list of classes.
ROOT_URL = 'https://www.deanza.edu/schedule/listings.html'
SCHEDULE_URL = 'https://www.deanza.edu/schedule/'  # De Anza's schedule page.
SEARCH_URL = 'https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2000&wt=json&json.' \
             'wrf=noCB&callback=noCB&q={}&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E' \
             '2000+teacherfullname_autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=score+desc&defType=edismax' \
             '&siteName=rmp&rows=2000&group=off&group.field=content_type_s&group.limit=2000&fq=schoolname_t%3A%22De+' \
             'Anza+College%22'  # Formattable URL to search for a De Anza professor on RateMyProf.


def get_depts(request):
    schedule_page = requests.get(SCHEDULE_URL)
    soup = BeautifulSoup(schedule_page.text)
    quarters = [{'name': button.text, 'value': button.attrs['value']} for button in soup.find('fieldset', id='term-select').find_all('button')]
    classes = [{'name': option.text, 'value': option.attrs['value']} for option in
               soup.find('select', id='dept-select').find_all('option')[1:]]
    response = json.dumps(classes)
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return '', 204, headers

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return response, 200, headers


def get_classes(request):
    dept_url = '{}?dept={}&t=W2019'.format(ROOT_URL, request.args['dept'])  # URL of classes page of a department.
    page = requests.get(dept_url)
    soup = BeautifulSoup(page.text)

    schedule_items = soup.select('tr.mix')  # Select rows containing class names.

    courses = set()

    for item in schedule_items:
        course_name = item.find_all('td')[1]
        if not course_name.find('span'):  # Some courses have labs listed as extra rows. Ignore those.
            courses.add(course_name.text)  # Add unencountered course names to courses list.

    response = json.dumps(list(courses))
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return '', 204, headers

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return response, 200, headers


def get_ratings(request):
    # Constructs an object that maps class names to names of professors who teach that class
    dept_url = '{}?dept={}&t=W2019'.format(ROOT_URL, request.args['dept'])
    page = requests.get(dept_url)
    soup = BeautifulSoup(page.text)

    schedule_items = soup.select('tr.mix')

    courses = {}

    for item in schedule_items:
        course_name = item.find_all('td')[1]
        prof_obj = {'name': '', 'days': '', 'times': '', 'class_features': []}
        try:
            item_tds = item.find_all('td')
            prof_obj = {'name': item_tds[7].text, 'days': item_tds[5].find('span', class_='days').text,
                        'times': item_tds[6].text,
                        'class_features': [x.attrs['title'] for x in item_tds[9].find_all('abbr')]}
        except IndexError:
            pass
        if course_name and not course_name.find('span'):
            course_name = course_name.text
            if course_name not in courses:
                courses[course_name] = []
            if prof_obj not in courses[course_name]:
                courses[course_name].append(prof_obj)

    # Gets ratings for each professor who teaches a given class
    course_profs = courses[request.args['class']]
    for index, prof in enumerate(course_profs):
        prof_req = requests.get(SEARCH_URL.format(prof['name']))
        response_obj = json.loads(re.sub(r'noCB\(', '', prof_req.text)[:-1])['response']
        if response_obj['numFound'] >= 1:
            ratings_obj = response_obj['docs'][0]
            ratings_obj['days'] = prof['days']
            ratings_obj['times'] = prof['times']
            ratings_obj['class_features'] = prof['class_features']
            course_profs[index] = ratings_obj
        else:
            course_profs[index]['teacherfullname_s'] = prof['name']
            course_profs[index].pop('name')

    response = json.dumps(course_profs)
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return '', 204, headers

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    return response, 200, headers
