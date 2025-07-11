from manim import *

class MapColoring(Scene):
    def construct(self):

        title = Text("Graph Coloring and Duality", font_size=36)
        self.play(Write(title))
        self.wait(1)

        map_countries = Polygon(
            [LEFT, RIGHT, UP, DOWN], fill_color=BLUE, fill_opacity=0.5
        )
        self.play(Create(map_countries))
        self.wait(1)

        colors = [RED, GREEN, BLUE, YELLOW, ORANGE]
        for i in range(5):
            country = Polygon(
                [LEFT, RIGHT, UP, DOWN], fill_color=colors[i], fill_opacity=0.5
            )
            self.play(FadeIn(country))
            self.wait(0.5)

        self.play(Indicate(map_countries))
        self.wait(1)

        algorithm_title = Text("Five-Coloring Algorithm", font_size=24)
        self.play(Write(algorithm_title))
        self.wait(1)

        removed_vertex = Circle(radius=0.2, color=WHITE).shift(UP)
        self.play(FadeIn(removed_vertex))
        self.wait(0.5)

        self.play(removed_vertex.animate.set_fill(RED, opacity=1))
        self.wait(0.5)

        self.play(removed_vertex.animate.set_fill(GREEN, opacity=1))
        self.wait(1)

        duality_title = Text("Graph Duality", font_size=24)
        self.play(Transform(algorithm_title, duality_title))
        self.wait(1)

        planar_graph = VGroup(
            Dot(LEFT + UP), Dot(LEFT + DOWN), Dot(RIGHT + UP), Dot(RIGHT + DOWN)
        )
        edges = Line(LEFT + UP, RIGHT + UP).set_color(WHITE)
        self.play(Create(planar_graph), Create(edges))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        final_message = Text("Every planar graph can be colored with 5 colors!", font_size=24)
        self.play(Write(final_message))
        self.wait(2)

        self.play(FadeOut(title), FadeOut(final_message), FadeOut(map_countries), FadeOut(planar_graph))
        self.wait(1)

        self.wait(67.2 - self.time_elapsed)