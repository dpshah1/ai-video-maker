from manim import *

class GraphTheoryIntro(Scene):
    def construct(self):

        title = Text("Introduction to Graph Theory", font_size=48)
        self.play(Write(title))
        self.wait(1)

        bridge_problem = Text("Königsberg Bridge Problem", font_size=36)
        bridge_problem.next_to(title, DOWN)
        self.play(Write(bridge_problem))
        self.wait(1)

        bridge_graph = VGroup(
            Circle(radius=0.5).shift(LEFT + UP),
            Circle(radius=0.5).shift(LEFT + DOWN),
            Circle(radius=0.5).shift(RIGHT + UP),
            Circle(radius=0.5).shift(RIGHT + DOWN)
        )
        self.play(Create(bridge_graph))
        self.wait(2)

        connectivity_text = Text("Network Connectivity", font_size=36)
        connectivity_text.next_to(bridge_graph, DOWN)
        self.play(Write(connectivity_text))
        self.wait(1)

        connected_graph = VGroup(
            Circle(radius=0.5).shift(LEFT + UP),
            Circle(radius=0.5).shift(LEFT + DOWN),
            Circle(radius=0.5).shift(RIGHT + UP),
            Circle(radius=0.5).shift(RIGHT + DOWN)
        )
        self.play(Transform(bridge_graph, connected_graph))
        self.wait(2)

        coloring_text = Text("Map Coloring", font_size=36)
        coloring_text.next_to(connectivity_text, DOWN)
        self.play(Write(coloring_text))
        self.wait(1)

        map_graph = VGroup(
            Square(side_length=1).shift(LEFT + UP),
            Square(side_length=1).shift(RIGHT + UP),
            Square(side_length=1).shift(LEFT + DOWN),
            Square(side_length=1).shift(RIGHT + DOWN)
        )
        self.play(Create(map_graph))
        self.wait(2)

        final_text = Text("Graph Theory in Real Life", font_size=36)
        final_text.next_to(map_graph, DOWN)
        self.play(Write(final_text))
        self.wait(1)

        self.play(FadeOut(title), FadeOut(bridge_problem), FadeOut(connectivity_text), FadeOut(coloring_text), FadeOut(map_graph), FadeOut(final_text))
        self.wait(1)